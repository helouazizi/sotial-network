package repositories

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

func (r *GroupRepository) SaveGroupPostRepo(ctx context.Context, group *models.GroupPost, img *models.Image) (models.GroupPost, models.GroupError) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return models.GroupPost{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: "failed to begin database transaction",
		}
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()
	const InsertPost = `
	 Insert INTO group_posts (group_id,member_id, title, content, media, created_at)
	 VAlUES (?, ?, ?, ?, ?, ?)
	 `
	fileName, ImageErr := utils.HandleImage(img, "pkg/db/images/groupePost")
	if ImageErr.Code != http.StatusOK {
		return models.GroupPost{}, ImageErr
	}

	res, err := tx.Exec(InsertPost,
		group.GroupId,
		group.Post.ID,
		group.Post.Title,
		group.Post.Content,
		fileName,
		time.Now(),
	)
	if err != nil {
		return models.GroupPost{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: "Failed to insert post",
		}
	}
	postID, _ := res.LastInsertId()
	group.Post.ID = int(postID)
	tx.Commit()
	return models.GroupPost{
		GroupId: group.GroupId,
			Post: models.Post{
				ID:        int(postID),
				MediaLink: fileName.String,
				Title:     group.Post.Title,
				Content:   group.Post.Content,
			},
		}, models.GroupError{
			Code:    http.StatusOK,
			Message: "The post was saved into the database successfully.",
		}
}

func (r *GroupRepository) GetGroupPosts(reg models.PaginationRequest, groupid int) ([]models.GroupPost, models.GroupError) {
	GetQuery := `
	SELECT 
		p.group_id,
		p.member_id,
		p.title,
		p.content,
		p.media,
		p.comments,
		p.created_at,
		u.first_name,
		u.last_name,
		u.nickname,
		u.avatar
	FROM group_posts p
	JOIN users u ON u.id = p.member_id
	WHERE p.group_id = ?
	ORDER BY p.created_at DESC
	LIMIT ? OFFSET ?
`

	rows, rowsErr := r.db.Query(GetQuery, groupid, reg.Limit, reg.Offset)
	if rowsErr != nil {
		return []models.GroupPost{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: rowsErr.Error(),
		}
	}
	var (
		posts []models.GroupPost
		media sql.NullString
	)

	for rows.Next() {
		var post models.GroupPost
		if err := rows.Scan(
			&post.GroupId,
			&post.Post.Author.ID,
			&post.Post.Title,
			&post.Post.Content,
			&media,
			&post.Post.TotalComments,
			&post.Post.CreatedAt,
			&post.Post.Author.FirstName,
			&post.Post.Author.Lastname,
			&post.Post.Author.Nickname,
			&post.Post.Author.Avatar,
		); err != nil {
			return []models.GroupPost{}, models.GroupError{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			}
		}
		if media.Valid {
			post.Post.MediaLink = media.String
		}
		posts = append(posts, post)

	}

	return posts, models.GroupError{
		Code:    http.StatusOK,
		Message: "Posts fetched successfully",
	}
}

func (r *GroupRepository) AddGroupComment(comments models.GroupComment, img *models.Image) models.GroupError {
	query := `
	INSERT INTO group_comments (group_post_id , member_id, content, media, created_at)
	VAlUES (?, ?, ?, ?, ?)

	`
	fileName, ImageErr := utils.HandleImage(img, "pkg/db/images/groupeComment")
	if ImageErr.Code != http.StatusOK {
		return ImageErr
	}
	stmt, err := r.db.Prepare(query)
	if err != nil {
		return models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}
	}
	defer stmt.Close()

	_, err = stmt.Exec(comments.Comment.PostID, comments.Comment.Author.ID, comments.Comment.Comment, fileName, time.Now())
	if err != nil {
		return models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}
	}
	return models.GroupError{
		Code:    http.StatusOK,
		Message: "adding comment went smouthly ",
	}
}

func (r *GroupRepository) GetGRoupComment( post_id  int) ([]models.GroupComment, models.GroupError) {
	query := `
  SELECT 
	c.group_post_id, 
	c.member_id, 
	c.content, 
	c.media, 
	c.created_at,
	u.first_name,
	u.last_name,
	u.nickname,
	u.avatar
FROM group_comments c
JOIN users u ON u.id = c.member_id
WHERE c.group_post_id = ?
ORDER BY c.created_at DESC;

	`
	rows, rowsErr := r.db.Query(query,post_id )
	if rowsErr != nil {
		return []models.GroupComment{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: rowsErr.Error(),
		}
	}
		var (
		comments []models.GroupComment
		media sql.NullString
	)
	for rows.Next() {
		var comment models.GroupComment
		if err := rows.Scan(
			&comment.Comment.PostID,
			&comment.Comment.Author.ID,
			
			&comment.Comment.Comment,
			&media,
		
			&comment.Comment.CreatedAt,
			&comment.Comment.Author.FirstName,
			&comment.Comment.Author.Lastname,
			&comment.Comment.Author.Nickname,
			&comment.Comment.Author.Avatar,
		);err != nil {
			return []models.GroupComment{}, models.GroupError{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			}
		}
		if media.Valid {
			comment.Comment.MediaLink = media.String
		}
		comments = append(comments, comment)
	}

			return comments , models.GroupError{
				Code: 200,
				Message: "Getting the comments went smouthly",
			}
}
