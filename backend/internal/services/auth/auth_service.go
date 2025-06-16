package services

import (
	"fmt"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type AuthService struct {
	repo *repositories.AuthRepository
}

func NewAuthService(Authrepo *repositories.AuthRepository) *AuthService {
	return &AuthService{repo: Authrepo}
}

func (s *AuthService) SaveUser(user *models.User) error {
	if len(user.Nickname) < 3 || len(user.Nickname) > 20 {
		return fmt.Errorf("Nickname must be betwwen 3 and 20 charachter")

	}
	if !utils.ValidPass(user.PassWord) {
		return fmt.Errorf("password is not valid")
	}






	return nil
}
