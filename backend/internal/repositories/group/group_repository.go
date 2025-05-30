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

func (r *GroupRepository) GetJoinedGroups(userID int) ([]*models.Group, error) {
	query := `
		SELECT g.* FROM groups g
		INNER JOIN group_members mb ON g.id = mb.group_id
		WHERE mb.member_id = ?
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}

	var groups []*models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(&group.ID, &group.UserID, &group.Title, &group.Description, &group.CreatedAt)
		if err != nil {
			return nil, err
		}

		groups = append(groups, &group)
	}

	return groups, err
}

func (r *GroupRepository) GetSuggestedGroups(userID int) ([]*models.Group, error) {
	query := `
		SELECT g.* FROM groups g 
		WHERE g.id NOT IN (
			SELECT gm.group_id FROM group_members gm
			WHERE gm.member_id = ?
		)
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}

	var groups []*models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(&group.ID, &group.UserID, &group.Title, &group.Description, &group.CreatedAt)
		if err != nil {
			return nil, err
		}

		groups = append(groups, &group)
	}

	return groups, nil
}
