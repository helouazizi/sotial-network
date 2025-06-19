package repositories

import (
	"database/sql"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepo(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) SavePost(post *models.Post, img *models.Image) error {
	query := `
		INSERT INTO posts (user_id, title, content, type, media, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	// change the media in db to be just tesxt
	stmt, err := r.db.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		post.UserID,
		post.Title,
		post.Content,
		post.Type,
		"avatar.png",
		time.Now(),
	)

	return err
}

func (r *PostRepository) GetPosts(start, limit int) ([]models.Post, error) {
	const q = `
	SELECT id, user_id, title, content, media, type, created_at
	FROM posts
	ORDER BY created_at DESC
	LIMIT ? OFFSET ?`
	rows, err := r.db.Query(q, limit, start)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		err := rows.Scan(&p.ID, &p.UserID, &p.Title, &p.Content,
			&p.Media, &p.Type, &p.CreatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}
