package services

import (
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

func (s *AuthService) SaveUser(user *models.User) models.Error {
	var Errors models.Error
	if !utils.ValidPass(user.PassWord) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Email = "password is not valid"

		return Errors
	}
	if !utils.ValidUsername(user.Nickname) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Nickname = "username is not valid"

		return Errors
	}
	if !utils.ValidEmail(user.Email) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Email = "Email is not valid"
		return Errors

	}
	if !utils.ValidName(user.FirstName) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.FirstName = "First Name is not valid"
		return Errors

	}
	if !utils.ValidName(user.Lastname) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Lastname = "Last Name is not valid"
		return Errors
	}
	if err := utils.ValidDateOfBirth(user.DateofBirth); err != nil {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.DateofBirth = "Date Of Birth is not valid"
		return Errors
	}
	if err := utils.ValidateAboutMe(user.AboutMe); err != nil {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.AboutMe = " About Me is not valid"
		return Errors

	}

	Errors = s.repo.SaveUser(user)

	return Errors
}
