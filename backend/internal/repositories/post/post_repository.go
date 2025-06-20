package repositories

import (
	"database/sql"
	"fmt"
	"io"
	"os"
	"path/filepath"
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

	// to reset the file in to 0 to read
	(*img.ImgContent).Seek(0, 0)

	path := filepath.Join("pkg/db/images/posts/", img.ImgHeader.Filename)

	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("could not save image: %w", err)
	}
	defer file.Close()
	_, err = io.Copy(file, *img.ImgContent)
	if err != nil {
		return fmt.Errorf("error writing image to disk: %w", err)
	}

	// do the other logic for db
	stmt, err := r.db.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		1,
		post.Title,
		post.Content,
		post.Type,
		img.ImgHeader.Filename,
		time.Now(),
	)

	return err
}

func (r *PostRepository) GetPosts(start, limit int) ([]models.Post, error) {
	const q = `
	SELECT id, title, content, media, type, created_at
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
		err := rows.Scan(&p.ID, &p.Title, &p.Content,
			&p.MediaLink, &p.Type, &p.CreatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}
