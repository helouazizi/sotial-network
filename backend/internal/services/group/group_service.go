package group

import (
	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/group"
)

type GroupService struct {
	repo *repositories.GroupRepository
}

func NewGroupService(repo *repositories.GroupRepository) *GroupService {
	return &GroupService{repo: repo}
}

func (s *GroupService) SaveGroup(group *models.Group) error {
	if len([]rune(group.Title)) > 100 || len([]rune(group.Description)) > 1000 {
		
	}

	return s.repo.SaveGroup(group)
}
