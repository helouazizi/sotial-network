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
	const qry = `
		INSERT INTO posts (user_id, title, content, type, media, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	var fileName sql.NullString // will be NULL if no image

	if img != nil && img.ImgContent != nil && img.ImgHeader != nil {
		// Reset file read pointer
		if seeker, ok := (img.ImgContent).(io.Seeker); ok {
			_, _ = seeker.Seek(0, io.SeekStart)
		}

		// Ensure directory exists
		const dir = "pkg/db/images/posts"
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return fmt.Errorf("ensure image dir: %w", err)
		}

		// Sanitize and generate unique filename
		origName := filepath.Base(img.ImgHeader.Filename) // basic sanitization

		path := filepath.Join(dir, origName)

		dst, err := os.Create(path)
		if err != nil {
			return fmt.Errorf("create image file: %w", err)
		}

		_, err = io.Copy(dst, img.ImgContent)
		dst.Close() // close file after copy
		if err != nil {
			return fmt.Errorf("write image: %w", err)
		}

		fileName = sql.NullString{String: origName, Valid: true}
	}

	stmt, err := r.db.Prepare(qry)
	if err != nil {
		return fmt.Errorf("prepare stmt: %w", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		1, // TODO: real user_id
		post.Title,
		post.Content,
		post.Type,
		fileName,
		time.Now(),
	)

	return err
}

func (r *PostRepository) GetPosts(start, limit int) ([]models.Post, error) {
	const q = `
	SELECT id, title, content, media, type, created_at, likes, dislikes, comments
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
		var media sql.NullString
		err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Content,
			&media, // scan media into sql.NullString
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
