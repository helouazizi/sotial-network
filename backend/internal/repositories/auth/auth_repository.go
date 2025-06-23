package repositories

import (
	"database/sql"
	"fmt"
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
		fmt.Println("CheckIfExiste")
		return err
	}
	if duplicate {
		fmt.Println("duplicate")
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
		fmt.Println("HashPassWord")
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
		avatar,
		token,
		created_at,
		updated_at
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
	`

	_, errExec := r.db.Exec(query,
		user.Lastname,
		user.FirstName,
		user.Nickname,
		user.Email,
		hashedPassword,
		user.DateofBirth,
		0,
		user.AboutMe,
		user.Avatar,
		user.Token,
		time.Now(),
		time.Now(),
	)

	if errExec != nil {
		fmt.Println(errExec)
		fmt.Println("db")
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

func (r *AuthRepository) GetUserCredential(user *models.User) (models.Error, models.UserCredential) {
	query := `
	SELECT email, password, token
	FROM users 	
	WHERE email = ?
	`

	var email, password, token string
	err := r.db.QueryRow(query, user.Email).Scan(&email, &password, &token)
	if err != nil {
		if err == sql.ErrNoRows {
			// Handle the case where no rows were returned
			return models.Error{
					Code:    http.StatusUnauthorized,
					Message: "Invalid credentials",
				}, models.UserCredential{}
		}
		return models.Error{
				Code:    http.StatusInternalServerError,
				Message: "Internal Server Error while saving user",
			}, models.UserCredential{}
	}

	return models.Error{
			Code:    http.StatusOK,
			Message: "User registered successfully",
		}, models.UserCredential{
			Token: token,
			Email: email,
			Pass:  password,
		}
}
