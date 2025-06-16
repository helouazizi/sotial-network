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

func (r *PostRepository) SavePost(post *models.Post) error {
	query := `
		INSERT INTO posts (user_id, title, content, type, media, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

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
		post.Media,
		time.Now(),
	)


	return err
}
