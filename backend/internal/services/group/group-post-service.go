package services

import (
	"context"
	"net/http"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
)

func (s *GroupService) SaveGroupePost(ctx context.Context, post *models.Post, img *models.Image) models.Error{
	if title := len(strings.Fields(post.Title)); title <= 0 || title >255 {

		return models.Error{
			Code: http.StatusBadRequest,
			Message: "title is required and must be less than 256 characters",
		}
	}
	if content := len(strings.Fields(post.Content)); content<= 0 || content > 500 {
		return models.Error{
			Code: http.StatusBadRequest,
			Message: "body is required and must be less than 500 characters",
		}
	}
	
	return models.Error{
			Code: http.StatusOK,
			Message: "saving the group post went smouthly ",
		}
}
