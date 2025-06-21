package services

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	"github.com/ismailsayen/social-network/pkg/token"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type AuthService struct {
	repo *repositories.AuthRepository
}

func NewAuthService(Authrepo *repositories.AuthRepository) *AuthService {
	return &AuthService{repo: Authrepo}
}

func (s *AuthService) SaveUser(user *models.User) (string, models.Error){
	var Errors models.Error

	// Validation checks
	if !utils.ValidPass(user.PassWord) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Email = "Password is not valid"
	}
	if !utils.ValidUsername(user.Nickname) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Nickname = "Username is not valid"
	}
	if !utils.ValidEmail(user.Email) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Email = "Email is not valid"
	}
	if !utils.ValidName(user.FirstName) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.FirstName = "First Name is not valid"
	}
	if !utils.ValidName(user.Lastname) {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Lastname = "Last Name is not valid"
	}
	if err := utils.ValidDateOfBirth(user.DateofBirth); err != nil {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.DateofBirth = "Date of Birth is not valid"
	}
	if err := utils.ValidateAboutMe(user.AboutMe); err != nil {
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.AboutMe = "About Me is not valid"
	}

	// Return early if any validation errors
	if Errors.UserErrors.HasErro {
		return "", Errors
	}

	// Generate session token
	token, tokenerr := token.GenerateToken() // assuming utils.GenerateToken exists
	if tokenerr != nil {
		return "", models.Error{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error while generating token",
		}
	}
	user.Token = token

	// Save user
	saveErr := s.repo.SaveUser(user)
	if saveErr.Code != http.StatusOK {
		return "", saveErr
	}

	


	

	// All good, return session
	return token,  models.Error{Code: http.StatusOK}
}

func (s *AuthService) LogUser(user *models.User) (string, models.Error) {
	if len(user.Email) == 0 {
		return "",  models.Error{
			Code:    http.StatusBadRequest,
			Message: "Email cannot be empty",
		}
	}
	if len(user.PassWord) == 0 {
		return  "",models.Error{
			Code:    http.StatusBadRequest,
			Message: "Password cannot be empty",
		}
	}
	Err, credentiale := s.repo.GetUserCredential(user)
	if Err.Code != http.StatusOK {
		
		return "", Err
	}
	err := utils.ComparePass([]byte(credentiale.Pass), []byte(user.PassWord))
	if err != nil {
		return "", models.Error{
			Code:    http.StatusUnauthorized,
			Message: "Invalid credentials ",
		}
	}
	
       
	
	return credentiale.Token, models.Error{
		Code: http.StatusOK,
		Message: "this operation went smouthly ",
	}
}
