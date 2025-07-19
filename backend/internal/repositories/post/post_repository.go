// backend/internal/repositories/post/post_repository.go
package repositories

import (
	"context"
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

func (r *PostRepository) SavePost(ctx context.Context, post *models.Post, img *models.Image) (models.Post, error) {
	//  lets craete a transaction
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return models.Post{}, fmt.Errorf("begin tx: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	const InsertPost = `
		INSERT INTO posts (user_id, title, content, type, media, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	fileName, err := handleImage(img)
	if err != nil {
		return models.Post{}, fmt.Errorf("handle image: %w", err)
	}

	res, err := tx.Exec(InsertPost,
		post.Author.ID,
		post.Title,
		post.Content,
		post.Type,
		fileName,
		time.Now(),
	)
	if err != nil {
		return models.Post{}, fmt.Errorf("exec insert post: %w", err)
	}

	postID, _ := res.LastInsertId()
	// add logic for pravte posts
	if post.Type == "private" && len(post.AllowedUsres) > 0 {
		const insertAllowedUsers = `
            INSERT INTO post_allowed_users (post_id, user_id) VALUES (?, ?)
        `

		stmt, err2 := tx.Prepare(insertAllowedUsers)
		if err2 != nil {
			return models.Post{}, fmt.Errorf("prepare audience stmt: %w", err2)
		}
		defer stmt.Close()

		for _, uid := range post.AllowedUsres {
			if _, err2 = stmt.Exec(postID, uid); err2 != nil {
				return models.Post{}, fmt.Errorf("insert user in private post  (%d): %w", uid, err2)
			}
		}
	}

	return models.Post{ID: int(postID), MediaLink: fileName.String}, tx.Commit()
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
				pr.reaction AS user_vote,

				u.first_name,
				u.last_name,
				u.nickname,
				u.avatar

			FROM posts p
			LEFT JOIN post_reactions pr ON pr.post_id = p.id AND pr.user_id = ?
			INNER JOIN users u ON u.id = p.user_id

			WHERE 
				-- Public posts
				p.type = 'public'

				-- Author's own posts
				OR (p.user_id = ?)

				-- Posts visible to followers
				OR (
					p.type = 'almost_private'
					AND EXISTS (
						SELECT 1 FROM followers f
						WHERE f.followed_id = ?
						AND f.follower_id = p.user_id
					)
				)

				-- Posts shared specifically with the user
				OR (
					p.type = 'private'
					AND EXISTS (
						SELECT 1 FROM post_allowed_users pau
						WHERE pau.post_id = p.id 
						AND pau.user_id = ?
					)
				)

			ORDER BY p.created_at DESC
			LIMIT ? OFFSET ?
    `

	rows, err := r.db.Query(q, userId, userId, userId, userId, limit, start)
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
			&cm.ID, &cm.PostID, &cm.Author.ID, &cm.Comment, &media, &cm.CreatedAt,
			&cm.Author.Nickname, &cm.Author.FirstName, &cm.Author.Lastname, &cm.Author.Avatar,
		)
		if err != nil {
			return nil, err
		}
		// if cm.Author.Nickname != "" {
		// 	cm.Author.FirstName = ""
		// 	cm.Author.Lastname = ""
		// }
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

func (r *PostRepository) CreatePostComment(coment models.Comment, img *models.Image) (*models.Comment,error) {
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
			return nil, fmt.Errorf("ensure image dir: %w", err)
		}

		// Sanitize and generate unique filename
		origName := filepath.Base(time.Now().Format(time.DateTime) + "_" + img.ImgHeader.Filename) // basic sanitization

		path := filepath.Join(dir, origName)

		dst, err := os.Create(path)
		if err != nil {
			return  nil,fmt.Errorf("create image file: %w", err)
		}

		_, err = io.Copy(dst, img.ImgContent)
		dst.Close() // close file after copy
		if err != nil {
			return  nil, fmt.Errorf("write image: %w", err)
		}

		fileName = sql.NullString{String: origName, Valid: true}
	}

	stmt, err := r.db.Prepare(qry)
	if err != nil {
		return   nil,fmt.Errorf("prepare stmt: %w", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		coment.PostID, coment.Author.ID, coment.Comment, fileName, coment.CreatedAt,
	)


	return &models.Comment{
		MediaLink: fileName.String,

	}, err
}

func (r *PostRepository) GetFollowers(userID int) ([]models.PostFolower, error) {
	const query = `
		SELECT id, nickname, first_name, last_name, avatar
		FROM users;
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query all users: %w", err)
	}
	defer rows.Close()

	var followers []models.PostFolower

	for rows.Next() {
		var f models.PostFolower
		if err := rows.Scan(
			&f.Id,
			&f.User.UserName,
			&f.User.FirstName,
			&f.User.LastName,
			&f.User.Avatar,
		); err != nil {
			return nil, fmt.Errorf("scan user: %w", err)
		}
		followers = append(followers, f)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil
}

func handleImage(img *models.Image) (sql.NullString, error) {
	var fileName sql.NullString // will be NULL if no image

	if img != nil && img.ImgContent != nil && img.ImgHeader != nil {
		// Reset file read pointer
		if seeker, ok := (img.ImgContent).(io.Seeker); ok {
			_, _ = seeker.Seek(0, io.SeekStart)
		}

		// Ensure directory exists
		const dir = "pkg/db/images/posts"
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return fileName, fmt.Errorf("ensure image dir: %w", err)
		}

		// Sanitize and generate unique filename
		origName := filepath.Base(time.Now().Format(time.DateTime) + "_" + img.ImgHeader.Filename)

		path := filepath.Join(dir, origName)

		dst, err := os.Create(path)
		if err != nil {
			return fileName, fmt.Errorf("create image file: %w", err)
		}

		_, err = io.Copy(dst, img.ImgContent)
		dst.Close() // close file after copy
		if err != nil {
			return fileName, fmt.Errorf("write image: %w", err)
		}

		fileName = sql.NullString{String: origName, Valid: true}
	}
	return fileName, nil
}
