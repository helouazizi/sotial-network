package services

import (
	"fmt"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
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
	if err:= s.CheckEmpty(user);err!=nil {
		return err
	}




	return nil
}
func (s *AuthService) CheckEmpty(user *models.User)error{

	if user.DateofBirth == "" {
	return fmt.Errorf("Date Of Birth Is Empty")
	}
		if user.Email == "" {
	return fmt.Errorf("Email Is Empty")
	}
		if user.FirstName == "" {
	return fmt.Errorf("First Name Is Empty")
	}
		if user.Lastname == "" {
	return fmt.Errorf("Last Name Is Empty")
	}
		if user.PassWord == "" {
	return fmt.Errorf("PassWord Is Empty")
	}


	return nil 

	
}