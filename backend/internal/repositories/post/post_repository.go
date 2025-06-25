package repositories

import (
	"database/sql"
	"errors"
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
		post.UserId,
		post.Title,
		post.Content,
		post.Type,
		fileName,
		time.Now(),
	)

	return err
}

func (r *PostRepository) GetPosts(userId, start, limit int) ([]models.Post, error) {
	const q = `
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
			pr.reaction AS user_vote
		FROM posts p
		LEFT JOIN post_reactions pr 
			ON pr.post_id = p.id AND pr.user_id = ?
		ORDER BY p.created_at DESC
		LIMIT ? OFFSET ?;
    `

	rows, err := r.db.Query(q, userId, limit, start)
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
			&p.UserVote,
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

func (r *PostRepository) PostVote(vote models.VoteRequest) error {
	// Validate action
	switch vote.Action {
	case "like", "dislike":
		// Insert or update the user's reaction
		_, err := r.db.Exec(`
			INSERT INTO post_reactions (user_id, post_id, reaction)
			VALUES (?, ?, ?)
			ON CONFLICT(user_id, post_id)
			DO UPDATE SET reaction = excluded.reaction
		`, vote.UserId, vote.PostID, vote.Action)
		return err

	case "unlike", "undislike":
		// Delete the user's reaction
		_, err := r.db.Exec(`
			DELETE FROM post_reactions WHERE user_id = ? AND post_id = ?
		`, vote.UserId, vote.PostID)
		return err

	default:
		return errors.New("invalid vote action")
	}
}

func (r *PostRepository) GetPostComments(c models.ComentPaginationRequest) ([]models.Comment, error) {
	query := `
		SELECT 
			c.id, c.post_id, c.user_id, c.comment, c.media, c.created_at,
			u.nickname, u.first_name, u.last_name , u.avatar
		FROM comments c
		LEFT JOIN users u ON c.user_id = u.id
		WHERE c.post_id = ?
		ORDER BY c.created_at DESC
	`
	// LIMIT ? OFFSET ?
	rows, err := r.db.Query(query, c.PostId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var cm models.Comment
		var media sql.NullString
		err := rows.Scan(
			&cm.ID, &cm.PostID, &cm.AuthorID, &cm.Comment, &media, &cm.CreatedAt,
			&cm.Author.UserName, &cm.Author.FirstName, &cm.Author.LastName, &cm.Author.Avatar,
		)
		if err != nil {
			return nil, err
		}
		if cm.Author.UserName != "" {
			cm.Author.FirstName = ""
			cm.Author.LastName = ""
		}
		if media.Valid {
			cm.MediaLink = media.String
		} else {
			cm.MediaLink = ""
		}
		comments = append(comments, cm)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}

func (r *PostRepository) CreatePostComment(coment models.Comment, img *models.Image) error {
	const qry = `
		INSERT INTO comments (post_id, user_id, comment,media, created_at)
		VALUES (?, ?, ?, ?, ?)
	`
	var fileName sql.NullString // will be NULL if no image

	if img != nil && img.ImgContent != nil && img.ImgHeader != nil {
		// Reset file read pointer
		if seeker, ok := (img.ImgContent).(io.Seeker); ok {
			_, _ = seeker.Seek(0, io.SeekStart)
		}

		// Ensure directory exists
		const dir = "pkg/db/images/comments"
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
		coment.PostID, coment.AuthorID, coment.Comment, fileName, coment.CreatedAt,
	)

	return err
}
