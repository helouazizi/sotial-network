package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

func (r *GroupRepository) SaveGroupPostRepo(ctx context.Context, group *models.GroupPost, img *models.Image) (models.Post, models.GroupError) {
 var(
	id int
	last string 
	first string
	neckname string
)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return  models.Post{}, models.GroupError{
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
		return  models.Post{}, ImageErr
	}

	res, err := tx.Exec(InsertPost,
		group.GroupId,
		group.Post.Author.ID,
		group.Post.Title,
		group.Post.Content,
		fileName,
		time.Now(),
	)
	if err != nil {
		return  models.Post{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: "Failed to insert post",
		}
	}
	query := `SELECT id, last_name , first_name, nickname FROM users WHERE  id = ?`
	ERR := tx.QueryRow(query,group.Post.Author.ID).Scan(&id,&last,&first, &neckname)
	fmt.Println(ERR)
	if ERR!= nil {
		return models.Post{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: "Failed to get the user info ",
		}
	}

	postID, _ := res.LastInsertId()
	group.Post.ID = int(postID)
	tx.Commit()
	return  models.Post{
		

			
				Author: models.User{
					ID: id,
					Nickname: neckname,
					FirstName: first,
					Lastname: last,
				},
				ID:        int(postID),
				MediaLink: fileName.String,
				Title:     group.Post.Title,
				Content:   group.Post.Content,
				
		
		}, models.GroupError{
			Code:    http.StatusOK,
			Message: "The post was saved into the database successfully.",
		}
}

func (r *GroupRepository) GetGroupPosts(reg models.PaginationRequest, groupid int) ([]models.Post, models.GroupError) {
	GetQuery := `
	SELECT 
		p.id,
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
		return []models.Post{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: rowsErr.Error(),
		}
	}
	var (
		posts []models.Post
		media sql.NullString
	)

	for rows.Next() {
		var post models.Post
		if err := rows.Scan(
			
			&post.ID,
			&post.Author.ID,
			&post.Title,
			&post.Content,
			&media,
			&post.TotalComments,
			&post.CreatedAt,
			&post.Author.FirstName,
			&post.Author.Lastname,
			&post.Author.Nickname,
			&post.Author.Avatar,
		); err != nil {
			return []models.Post{}, models.GroupError{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			}
		}
		if media.Valid {
			post.MediaLink = media.String
		}
		posts = append(posts, post)

	}

	return posts, models.GroupError{
		Code:    http.StatusOK,
		Message: "Posts fetched successfully",
	}
}

func (r *GroupRepository) AddGroupComment(comments models.Comment, img *models.Image) models.GroupError {
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

	_, err = stmt.Exec(comments.PostID, comments.Author.ID, comments.Comment, fileName, time.Now())
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

func (r *GroupRepository) GetGRoupComment( post_id  int) ([]models.Comment, models.GroupError) {
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
		return []models.Comment{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: rowsErr.Error(),
		}
	}
		var (
		comments []models.Comment
		media sql.NullString
	)
	for rows.Next() {
		var comment models.Comment
		if err := rows.Scan(
			&comment.PostID,
			&comment.Author.ID,
			
			&comment.Comment,
			&media,
		
			&comment.CreatedAt,
			&comment.Author.FirstName,
			&comment.Author.Lastname,
			&comment.Author.Nickname,
			&comment.Author.Avatar,
		);err != nil {
			return []models.Comment{}, models.GroupError{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			}
		}
		if media.Valid {
			comment.MediaLink = media.String
		}
		comments = append(comments, comment)
	}

			return comments , models.GroupError{
				Code: 200,
				Message: "Getting the comments went smouthly",
			}
}
