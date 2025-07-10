package repositories

import (
	"context"
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
