package services

import (
	"errors"

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
	if !utils.ValidPass(user.PassWord) {
		return errors.New("password is not valid")
	}
	if !utils.ValidUsername(user.Nickname){
		return errors.New("username is not valid")
	}
	if !utils.ValidEmail(user.Email){
		return errors.New("Email is not valid")
	}
	if !utils.ValidName(user.FirstName){
		return errors.New("First Name is not valid")
	}
	if !utils.ValidName(user.Lastname){
		return errors.New("Last Nameis not valid")
	}
	if err:= utils.ValidDateOfBirth(user.DateofBirth) ; err!= nil {
		return err
	}




	return nil
}
