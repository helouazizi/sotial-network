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
		&profile.Id, &profile.Nickname, &profile.LastName,
		&profile.FirstName, &profile.Email, &profile.Avatar, &profile.DateOfBirth,
		&profile.IsPrivate, &profile.AboutMe,
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
		profile.AboutMe = ""
		profile.Email = ""
		profile.DateOfBirth = ""
		return &profile, nil
	}

	profile.ImFollower = (status == "accepted") || (profile.IsPrivate == 0)

	profile.Posts, err = repo.GetPosts(userId)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (repo *ProfileRepository) GetPosts(userId int) ([]models.Post, error) {
	const q = `
	SELECT id, title, content, media, type, created_at, likes, dislikes, comments
	FROM posts
	WHERE user_id=?
	ORDER BY created_at DESC
	LIMIT 15 OFFSET 0;
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
