package repositories

import (
	"database/sql"

	"github.com/ismailsayen/social-network/internal/models"
)

type AuthRepository struct {
	db *sql.DB
}

func NewAuthRepo(db *sql.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) SaveUser(user *models.User) {
}
