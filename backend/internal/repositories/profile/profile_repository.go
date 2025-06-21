package profile

import (
	"database/sql"
	"fmt"

	"github.com/ismailsayen/social-network/internal/models"
)

type ProfileRepository struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (repo *ProfileRepository) GetMyProfile(sessionID, userId int, profile *models.CommunInfoProfile) (*models.CommunInfoProfile, error) {
	query := `
		SELECT 
		u.id,
		u.nickname,
		u.last_name,
		u.first_name,
		u.email,
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
	err := repo.db.QueryRow(query, userId).Scan(&profile.Id, &profile.Nickname, &profile.LastName, &profile.FirstName, &profile.Email, &profile.DateOfBirth, &profile.IsPrivate, &profile.AboutMe, &profile.Followers, &profile.Followed, &profile.NbPosts)
	if err != nil {
		return nil, err
	}
	if sessionID == userId {
		profile.MyAcount = true
		profile.Posts, err = repo.GetPosts(userId)
		if err != nil {
			return nil, err
		}
	}
	return profile, nil
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
	fmt.Println(posts)
	return posts, rows.Err()
}
