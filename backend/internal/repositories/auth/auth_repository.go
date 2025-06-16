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
	HashPassWord, err := utils.HashPassWord(user.PassWord)
	if err != nil {
		return models.Error{
			Code:    500,
			Message: "Internal Server Error ",
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
	_, err = r.db.Exec(query,
		user.Lastname,
		user.FirstName,
		user.Nickname,
		user.Email,
		HashPassWord,
		user.DateofBirth,
		0,
		user.AboutMe,
		time.Now(),
		time.Now(),
	)
	if err != nil {
		return models.Error{
			Code:    500,
			Message: "Internal Server Error ",
		}
	}
	return models.Error{
		Message: "seccefully created your account",
		Code:    http.StatusCreated,
	}
}
