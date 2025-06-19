package services

import (
	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/profile"
)

type ProfileService struct {
	repo *repositories.ProfileRepository
}

func NewProfileService(repo *repositories.ProfileRepository) *ProfileService {
	return &ProfileService{repo: repo}
}

func (s *ProfileService) GetProfile(sessionID, userId int) (*models.CommunInfoProfile, error) {
	var profile models.CommunInfoProfile
	if sessionID == userId {
		return s.repo.GetMyProfile(sessionID, &profile)
	} else {
		return s.repo.GetMyProfile(sessionID, &profile)
	}
}
