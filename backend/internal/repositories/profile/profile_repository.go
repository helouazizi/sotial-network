package profile

import (
	"database/sql"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strings"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type ProfileRepository struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (repo *ProfileRepository) GetMyProfile(sessionID, userId int) (*models.CommunInfoProfile, error) {
	query := `
		SELECT 
			u.id,
			u.nickname,
			u.last_name,
			u.first_name,
			u.email,
			u.avatar,
			u.date_of_birth,
			u.is_private,
			u.about_me,
			COUNT(DISTINCT f1.follower_id) AS followers,
			COUNT(DISTINCT f2.followed_id) AS followed,
			COUNT(DISTINCT p.id) AS nbPosts
		FROM users u
		LEFT JOIN followers f1 ON u.id = f1.followed_id AND f1.status = 'accepted'
		LEFT JOIN followers f2 ON u.id = f2.follower_id AND f2.status = 'accepted'
		LEFT JOIN posts p ON u.id = p.user_id
		WHERE u.id = ?
		GROUP BY u.id;
	`

	var profile models.CommunInfoProfile
	err := repo.db.QueryRow(query, userId).Scan(
		&profile.User.ID, &profile.User.Nickname, &profile.User.Lastname,
		&profile.User.FirstName, &profile.User.Email, &profile.User.Avatar, &profile.User.DateofBirth,
		&profile.IsPrivate, &profile.User.AboutMe,
		&profile.Followers, &profile.Followed, &profile.NbPosts,
	)
	if err != nil {
		return nil, err
	}

	if sessionID == userId {
		profile.MyAcount = true
		profile.Posts, err = repo.GetPosts(userId)
		if err != nil {
			return nil, err
		}
		return &profile, nil
	}

	status, err := repo.getFollowStatus(sessionID, userId, profile.IsPrivate, &profile)
	if err != nil {
		return nil, err
	}
	if status == "" {
		status = "follow"
	}

	profile.Subscription = &models.Subscription{
		Status:     status,
		FollowerID: sessionID,
		FollowedID: userId,
	}

	if profile.IsPrivate == 1 && status != "accepted" {
		profile.User.AboutMe = ""
		profile.User.Email = ""
		profile.User.DateofBirth = ""
		return &profile, nil
	}

	profile.ImFollower = (status == "accepted") || (profile.IsPrivate == 0)

	profile.Posts, err = repo.GetFiltredPosts(sessionID, userId)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (repo *ProfileRepository) GetPosts(userId int) ([]models.Post, error) {
	const q = `
				SELECT 
				p.id, p.title, p.content, p.media, p.type, p.created_at, 
				p.likes, p.dislikes, p.comments, 
				pr.reaction AS user_vote, 
				u.first_name, u.last_name, u.nickname, u.avatar
				FROM posts p
				LEFT JOIN post_reactions pr ON pr.post_id = p.id AND pr.user_id = $1
				INNER JOIN users u ON u.id = p.user_id
				WHERE p.user_id = $1
				ORDER BY p.created_at DESC
`
	rows, err := repo.db.Query(q, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var media sql.NullString
		err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Content,
			&media,
			&p.Type,
			&p.CreatedAt,
			&p.Likes,
			&p.Dislikes,
			&p.TotalComments,
			&p.UserVote,
			&p.Author.FirstName,
			&p.Author.Lastname,
			&p.Author.Nickname,
			&p.Author.Avatar,
		)
		if err != nil {
			return nil, err
		}

		if media.Valid {
			p.MediaLink = media.String
		} else {
			p.MediaLink = ""
		}

		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func (repo *ProfileRepository) getFollowStatus(sessionID, userId, visibility int, profile *models.CommunInfoProfile) (string, error) {
	var status string
	query := `
		SELECT status 
		FROM followers 
		WHERE follower_id=? AND followed_id=? AND (status='accepted' OR status='pending');
	`
	err := repo.db.QueryRow(query, sessionID, userId).Scan(&status)
	if err == sql.ErrNoRows {
		return "", nil
	}

	if err != nil {
		return "", err
	}
	if status == "pending" && visibility == 0 {
		query = `UPDATE followers SET status='accepted' WHERE follower_id=? AND followed_id=?; `
		_, err = repo.db.Exec(query, sessionID, userId)
		if err != nil {
			return "", err
		}
		status = "accepted"
		profile.Followers += 1
	}

	return status, nil
}

func (repo *ProfileRepository) ChangeVisbility(sessionID, to int) error {
	query := `UPDATE users SET is_private=?, updated_at=? WHERE id=?;`
	_, err := repo.db.Exec(query, to, time.Now(), sessionID)
	if err != nil {
		return err
	}
	return nil
}

func (repp *ProfileRepository) UpdateProfile(fileHeader *multipart.FileHeader, nickname, about, oldAvatar string, sessionId int) (string, error) {
	var AvatarPath string

	if fileHeader == nil {
		AvatarPath = oldAvatar
	} else {
		sanitizedFilename := strings.ReplaceAll(fileHeader.Filename, " ", "_")
		AvatarPath = fmt.Sprintf("%d_%s", time.Now().Unix(), sanitizedFilename)

		dst, err := os.Create("pkg/db/images/user/" + AvatarPath)
		if err != nil {
			return "", err
		}
		defer dst.Close()

		src, err := fileHeader.Open()
		if err != nil {
			return "", err
		}
		defer src.Close()

		_, err = io.Copy(dst, src)
		if err != nil {
			return "", err
		}
	}

	query := `UPDATE users
              SET avatar=?, nickname=?, about_me=?
              WHERE id=?;`

	_, err := repp.db.Exec(query, AvatarPath, nickname, about, sessionId)
	if err != nil {
		return "", err
	}

	return AvatarPath, nil
}

func (repo *ProfileRepository) GetFiltredPosts(sessionID, userId int) ([]models.Post, error) {
	query := `
			SELECT
				p.id,
				p.title,
				p.content,
				p.media,
				p.type,
				p.created_at,
				p.likes,
				p.dislikes,
				p.comments,
				pr.reaction AS user_vote,

				u.first_name,
				u.last_name,
				u.nickname,
				u.avatar

			FROM posts p
			LEFT JOIN post_reactions pr ON pr.post_id = p.id AND pr.user_id = $1
			INNER JOIN users u ON u.id = p.user_id

			WHERE p.user_id = $2 AND (
				-- Public posts
				p.type = 'public'
				
				-- Posts visible to followers
				OR (
					p.type = 'almost_private'
					AND EXISTS (
						SELECT 1 FROM followers f
						WHERE f.followed_id = $1
						AND f.follower_id = p.user_id
					)
				)

				-- Posts shared specifically with the user
				OR (
					p.type = 'private'
					AND EXISTS (
						SELECT 1 FROM post_allowed_users pau
						WHERE pau.post_id = p.id 
						AND pau.user_id = $1
					)
					))
				ORDER BY p.created_at DESC;
				
    `

	rows, err := repo.db.Query(query, sessionID, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var (
			p     models.Post
			media sql.NullString
		)
		if err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Content,
			&media,
			&p.Type,
			&p.CreatedAt,
			&p.Likes,
			&p.Dislikes,
			&p.TotalComments,
			&p.UserVote,
			&p.Author.FirstName,
			&p.Author.Lastname,
			&p.Author.Nickname,
			&p.Author.Avatar,
		); err != nil {
			return nil, err
		}

		if media.Valid {
			p.MediaLink = media.String
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}
