package group

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type GroupRepository struct {
	db *sql.DB
}

func NewGroupRepo(db *sql.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

func (r *GroupRepository) SaveGroup(group *models.Group) *models.GroupError {
	query := `
		INSERT INTO groups(user_id, title, description, created_at) VALUES (?, ?, ?, ?)
	`

	_, err := r.db.Exec(query, group.UserID, group.Title, group.Description, time.Now())
	if err != nil {
		return &models.GroupError{
			Message: err.Error(),
			Code:    http.StatusInternalServerError,
		}
	}

	return nil
}
