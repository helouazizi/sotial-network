package group

import (
	"database/sql"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type GroupRepository struct {
	db *sql.DB
}

func NewGroupRepo(db *sql.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

func (r *GroupRepository) SaveGroup(group *models.Group) error {
	query := `
		INSERT INTO groups(user_id, title, description, created_at) VALUES (?, ?, ?, ?)
	`
	_, err := r.db.Exec(query, group.UserID, group.Title, group.Description, time.Now())
	if err != nil {
		return err
	}

	return nil
}
