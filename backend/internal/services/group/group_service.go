package group

import (
	"net/http"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/group"
)

type GroupService struct {
	repo *repositories.GroupRepository
}

func NewGroupService(repo *repositories.GroupRepository) *GroupService {
	return &GroupService{repo: repo}
}

func (s *GroupService) SaveGroup(group *models.Group) *models.GroupError {
	group.Title = strings.TrimSpace(group.Title)
	group.Description = strings.TrimSpace(group.Description)

	if len([]rune(group.Title)) == 0 {
		return &models.GroupError{
			Message: "group title is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(group.Description)) == 0 {
		return &models.GroupError{
			Message: "group description is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(group.Title)) > 100 {
		return &models.GroupError{
			Message: "group title must not exceed 100 characters",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(group.Description)) > 1000 {
		return &models.GroupError{
			Message: "group description must not exceed 1000 characters",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.SaveGroup(group)
}
