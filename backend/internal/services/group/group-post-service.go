package services

import (
	"context"
	"net/http"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

func (s *GroupService) SaveGroupePost(ctx context.Context, group *models.GroupPost, img *models.Image) (models.GroupPost,models.GroupError){
	if title := len(strings.Fields(group.Post.Title)); title <= 0 || title >255 {

		return models.GroupPost{},models.GroupError{
			Code: http.StatusBadRequest,
			Message: "title is required and must be less than 256 characters",
		}
	}
	if content := len(strings.Fields(group.Post.Content)); content<= 0 || content > 500 {
		return models.GroupPost{},models.GroupError{
			Code: http.StatusBadRequest,
			Message: "body is required and must be less than 500 characters",
		}
	}
	ImageErr := utils.CheckImage(img)
	if ImageErr.Code != http.StatusOK {
		return models.GroupPost{},models.GroupError{
			Code: http.StatusInternalServerError,
			Message:"error while validating the image",
		}
	}
return s.repo.SaveGroupPostRepo(ctx,group,img)


	
	
}
