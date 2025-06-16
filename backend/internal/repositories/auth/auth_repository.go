package repositories

import (
	"database/sql"
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
	dublicate, Error := r.CheckTheExiste(user)
	if dublicate {
		usererror := models.UserError{
			HasErro:  true,
			Nickname: "neckname or Email already existe ",
			Email:    "neckname or Email already existe ",
		}
		return models.Error{
			UserErrors: usererror,
		}

	}
	return Error
}

func (r *AuthRepository) CheckTheExiste(user *models.User) (bool, models.Error) {
	var isExiste bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE email = ? OR nickname = ?)"
	err := r.db.QueryRow(query, user.Email, user.Nickname).Scan(&isExiste)
	if err != nil && err != sql.ErrNoRows {
		return false, models.Error{
			Code:    500,
			Message: "Internale Server Error",
		}
	}
	return isExiste, models.Error{
		Code:    200,
		Message: "this operation want smouthly",
	}
}
