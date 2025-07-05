package group

import repositories "github.com/ismailsayen/social-network/internal/repositories/group"

type GroupService struct {
	repo *repositories.GroupRepository
}

func NewGroupService(repo *repositories.GroupRepository) *GroupService {
	return &GroupService{repo: repo}
}