package services

import repositories "github.com/ismailsayen/social-network/internal/repositories/profile"

type ProfileService struct {
	repo *repositories.ProfileRepository
}

func NewProfileService(repo *repositories.ProfileRepository) *ProfileService {
	return &ProfileService{repo: repo}
}
