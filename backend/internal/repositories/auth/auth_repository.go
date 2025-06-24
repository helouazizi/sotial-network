package repositories

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
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

	hashedPassword, errHash := utils.HashPassWord(user.PassWord)
	if errHash != nil {
		fmt.Println("HashPassWord")
		return models.Error{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error while hashing password",
		}
	}
	user.Nickname = strings.TrimSpace(user.Nickname)
	var nickname *string
	if user.Nickname == "" {
		nickname = nil
	} else {
		nickname = &user.Nickname
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
		nickname,
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

func (r *AuthRepository) CheckIfExiste(user *models.User) (bool, models.Error) {
	var emailExists bool

	// Check if email exists
	queryEmail := "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)"
	err := r.db.QueryRow(queryEmail, user.Email).Scan(&emailExists)
	if err != nil {
		return false,  models.Error{
			Code:    500,
			Message: "Internal Server Error while checking email",
		}
	}


	// Determine what exists
	if emailExists {
		return true,  models.Error{
			Code:    409, // Conflict
			Message: "Email already in use",
		}
	}
	

	// If neither exists
	return false,models.Error{
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
