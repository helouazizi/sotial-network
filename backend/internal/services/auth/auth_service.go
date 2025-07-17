package services

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
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

func (s *AuthService) SaveUser(user *models.User) (string, models.Error) {
	var Errors models.Error

	// === Validation ===
	if !utils.ValidPass(user.PassWord) {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.PassWord = "Password is not valid"
	}
	if !utils.ValidUsername(user.Nickname) {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Nickname = "Username is not valid"
	}
	if !utils.ValidEmail(user.Email) {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Email = "Email is not valid"
	}
	if !utils.ValidName(user.FirstName) {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.FirstName = "First Name is not valid"
	}
	if !utils.ValidName(user.Lastname) {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.Lastname = "Last Name is not valid"
	}
	if err := utils.ValidDateOfBirth(user.DateofBirth); err != nil {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.DateofBirth = "Date of Birth is not valid"
	}
	if err := utils.ValidateAboutMe(user.AboutMe); err != nil {
		Errors.Code = http.StatusBadRequest
		Errors.UserErrors.HasErro = true
		Errors.UserErrors.AboutMe = "About Me is not valid"
	}

	// === Return early if any validation error ===
	if Errors.UserErrors.HasErro {
		return "", Errors
	}

	// === Check for duplicate user ===
	duplicate, err := s.repo.CheckIfExiste(user)
	if err.Code != http.StatusOK {
		return "", err
	}
	if duplicate {
		userError := models.UserError{
			HasErro: true,
			Email:   "Email already exists",
		}
		return "", models.Error{
			Code:       http.StatusConflict,
			Message:    "Email already exists",
			UserErrors: userError,
		}
	}

	// === Save Avatar if exists ===
	if user.FileErr == nil && user.File != nil {
		defer user.File.Close()

		avatarPath := filepath.Join("pkg/db/images/user", user.Avatar)
		err := os.MkdirAll(filepath.Dir(avatarPath), os.ModePerm)
		if err != nil {
			return "", models.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to create directories for avatar",
			}
		}

		dst, err := os.Create(avatarPath)
		if err != nil {
			return "", models.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to save avatar",
			}
		}
		defer dst.Close()

		_, err = io.Copy(dst, user.File)
		if err != nil {
			return "", models.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to save avatar",
			}
		}
	}

	// === Generate token ===
	token, tokenerr := token.GenerateToken()
	if tokenerr != nil {
		return "", models.Error{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error while generating token",
		}
	}
	user.Token = token

	// === Save user in DB ===
	saveErr := s.repo.SaveUser(user)
	if saveErr.Code != http.StatusOK {
		return "", saveErr
	}

	// === Success ===
	return token, models.Error{Code: http.StatusOK}
}

func (s *AuthService) LogUser(user *models.User) (string, models.Error) {
	if len(user.Email) == 0 {
		return "", models.Error{
			Code:    http.StatusBadRequest,
			Message: "Email cannot be empty",
		}
	}
	if len(user.PassWord) == 0 {
		return "", models.Error{
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
		Code:    http.StatusOK,
		Message: "this operation went smouthly ",
	}
}

func (s *AuthService) HundleAvatar(user *models.User) (models.User, models.Error) {
	if user.FileErr == nil && user.File != nil {
		defer user.File.Close()

		// Generate a unique filename and save path
		// user.Header.Filename

		ext := filepath.Ext(user.Header.Filename)

		filename := fmt.Sprintf("%s_%s", uuid.New().String(), ext)

		// Save the path in the user struct
		user.Avatar = filename
	} else {
		// No avatar uploaded, optional - you can set default or leave empty
		user.Avatar = ""
	}
	return *user, models.Error{
		Code:    http.StatusOK,
		Message: "avatar ops went smouthly",
	}
}

func (s *AuthService) GetUser(userID int) (*models.User, error) {
	return s.repo.GetUser(userID)
}

func (s *AuthService) GetFriends(userID int) ([]*models.User, error) {
	return s.repo.GetFriends(userID)
}
