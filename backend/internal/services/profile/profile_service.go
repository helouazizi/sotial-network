package services

import (
	"mime/multipart"
	"os"

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
	return s.repo.GetMyProfile(sessionID, userId)
}

func (s *ProfileService) ChangeVisbility(sessionID, to int) error {
	return s.repo.ChangeVisbility(sessionID, to)
}

func (s *ProfileService) UpdateProfile(fileHeader *multipart.FileHeader, nickname, about, oldAvatar string, sessionId int) (string, error) {
	if fileHeader != nil && oldAvatar != "" && fileHeader.Filename != oldAvatar {
		e := os.Remove("pkg/db/images/user/" + oldAvatar)
		if e != nil {
			return "", e
		}
	}

	return s.repo.UpdateProfile(fileHeader, nickname, about, oldAvatar, sessionId)
}
