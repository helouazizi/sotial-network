package services

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

func (s *GroupService) SaveGroupePost(ctx context.Context, group *models.GroupPost, img *models.Image) (models.GroupPost, models.GroupError) {
	if title := len(strings.Fields(group.Post.Title)); title <= 0 || title > 255 {
		return models.GroupPost{}, models.GroupError{
			Code:    http.StatusBadRequest,
			Message: "title is required and must be less than 256 characters",
		}
	}
	if content := len(strings.Fields(group.Post.Content)); content <= 0 || content > 500 {
		return models.GroupPost{}, models.GroupError{
			Code:    http.StatusBadRequest,
			Message: "body is required and must be less than 500 characters",
		}
	}
	ImageErr := utils.CheckImage(img)
	if ImageErr.Code != http.StatusOK {
		return models.GroupPost{}, models.GroupError{
			Code:    http.StatusInternalServerError,
			Message: "error while validating the image",
		}
	}
	return s.repo.SaveGroupPostRepo(ctx, group, img)
}

func (s *GroupService) GetGroupsPost(reg models.PaginationRequest , groupIdstr string) ([]models.GroupPost, models.GroupError) {
	if reg.Limit <= 0 || reg.Offset < 0 {
		return []models.GroupPost{}, models.GroupError{
			Code:    http.StatusBadRequest,
			Message: "Limit must be greater than 0 and offset cannot be negative",
		}
	}
	groupId, err := strconv.Atoi(groupIdstr)
	if err != nil || groupId <= 0 {
		return []models.GroupPost{}, models.GroupError{
			Code:    http.StatusBadRequest,
			Message: "Limit must be greater than 0 and offset cannot be negative",
		}
	}
	return s.repo.GetGroupPosts(reg, groupId)
	
	
}
