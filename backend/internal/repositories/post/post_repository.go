package repositories

import (
	"database/sql"

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
		INSERT INTO posts (user_id, title, content, type)
		VALUES (?, ?, ?, ?)
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
	)


	return err
}
