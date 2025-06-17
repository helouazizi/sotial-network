package repositories

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type AuthRepository struct {
	db *sql.DB
}

func NewAuthRepo(db *sql.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) SaveUser(user *models.User) models.Error {
	duplicate, field, err := r.CheckIfExiste(user)
	if err.Code != http.StatusOK {
		return err
	}
	if duplicate {
		userError := models.UserError{
			HasErro: true,
		}
		msg := ""

		switch field {
		case "email":
			userError.Email = "Email already exists"
			msg = "Email already exists"
		case "nickname":
			userError.Nickname = "Nickname already exists"
			msg = "Nickname already exists"
		default:
			msg = "Email or nickname already exists"
		}

		return models.Error{
			Code:       http.StatusConflict, // 409 Conflict
			UserErrors: userError,
			Message:    msg,
		}
	}

	hashedPassword, errHash := utils.HashPassWord(user.PassWord)
	if errHash != nil {
		return models.Error{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error while hashing password",
		}
	}

	query := `
	INSERT INTO users (
		last_name,
		first_name,
		nickname,
		email,
		password,
		date_of_birth,
		is_private,
		about_me,
		created_at,
		updated_at
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
	`

	_, errExec := r.db.Exec(query,
		user.Lastname,
		user.FirstName,
		user.Nickname,
		user.Email,
		hashedPassword,
		user.DateofBirth,
		0, // is_private default false
		user.AboutMe,
		time.Now(),
		time.Now(),
	)

	if errExec != nil {
		return models.Error{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error while saving user",
		}
	}

	return models.Error{
		Code:    http.StatusOK,
		Message: "User registered successfully",
	}
}

func (r *AuthRepository) CheckIfExiste(user *models.User) (bool, string, models.Error) {
	var emailExists, nicknameExists bool

	// Check if email exists
	queryEmail := "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)"
	err := r.db.QueryRow(queryEmail, user.Email).Scan(&emailExists)
	if err != nil {
		return false, "", models.Error{
			Code:    500,
			Message: "Internal Server Error while checking email",
		}
	}

	// Check if nickname exists only if provided
	if user.Nickname != "" {
		queryNickname := "SELECT EXISTS(SELECT 1 FROM users WHERE nickname = ?)"
		err = r.db.QueryRow(queryNickname, user.Nickname).Scan(&nicknameExists)
		if err != nil {
			return false, "", models.Error{
				Code:    500,
				Message: "Internal Server Error while checking nickname",
			}
		}
	}

	// Determine what exists
	if emailExists {
		return true, "email", models.Error{
			Code:    409, // Conflict
			Message: "Email already in use",
		}
	}
	if nicknameExists {
		return true, "nickname", models.Error{
			Code:    409, // Conflict
			Message: "Nickname already in use",
		}
	}

	// If neither exists
	return false, "none", models.Error{
		Code:    200,
		Message: "No duplicate found",
	}
}
