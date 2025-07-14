package services

import (
	"net/http"
	"strconv"
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

func (s *GroupService) SaveGroup(group *models.Group) (int, *models.GroupError) {
	group.Title = strings.TrimSpace(group.Title)
	group.Description = strings.TrimSpace(group.Description)

	if len([]rune(group.Title)) == 0 {
		return -1, &models.GroupError{
			Message: "group title is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(group.Description)) == 0 {
		return -1, &models.GroupError{
			Message: "group description is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(group.Title)) > 100 {
		return -1, &models.GroupError{
			Message: "group title must not exceed 100 characters",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(group.Description)) > 1000 {
		return -1, &models.GroupError{
			Message: "group description must not exceed 1000 characters",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.SaveGroup(group)
}

func (s *GroupService) GetJoinedGroups(userID int) ([]*models.Group, error) {
	return s.repo.GetJoinedGroups(userID)
}

func (s *GroupService) GetSuggestedGroups(userID int) ([]*models.Group, error) {
	return s.repo.GetSuggestedGroups(userID)
}

func (s *GroupService) GetGroup(GroupId string) (models.GroupIfo, *models.GroupError) {
	id, err := strconv.Atoi(GroupId)
	if err != nil {
		return models.GroupIfo{}, &models.GroupError{
			Message: "group id is required",
			Code:    http.StatusBadRequest,
		}
	}
	return s.repo.GetGroup(id)
}

func (s *GroupService) SaveJoinGroupRequest(groupReq *models.GroupRequest) error {
	return s.repo.SaveJoinGroupRequest(groupReq)
}
