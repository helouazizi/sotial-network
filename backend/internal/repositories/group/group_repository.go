package repositories

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type GroupRepository struct {
	db *sql.DB
}

func NewGroupRepo(db *sql.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

func (r *GroupRepository) SaveGroup(group *models.Group) (int, *models.GroupError) {
	query := `
		INSERT INTO groups(user_id, title, description, created_at) VALUES (?, ?, ?, ?) RETURNING id
	`

	var groupID int
	err := r.db.QueryRow(query, group.UserID, group.Title, group.Description, time.Now()).Scan(&groupID)
	if err != nil {
		return -1, &models.GroupError{
			Message: err.Error(),
			Code:    http.StatusInternalServerError,
		}
	}

	queryGroupMember := `
		INSERT INTO group_members(group_id, member_id) VALUES (?, ?)
	`

	_, err = r.db.Exec(queryGroupMember, groupID, group.UserID)
	if err != nil {
		return -1, &models.GroupError{
			Message: err.Error(),
			Code:    http.StatusInternalServerError,
		}
	}

	return groupID, nil
}

func (r *GroupRepository) GetJoinedGroups(userID int) ([]*models.Group, error) {
	query := `
		SELECT g.* FROM groups g
		INNER JOIN group_members mb ON g.id = mb.group_id
		WHERE mb.member_id = ?
		ORDER BY g.id desc
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

func (r *GroupRepository) GetInfoGroupeRepo(GrpID string, sessionID int) (*models.Group, error) {
	query := `SELECT 
				g.id, 
				g.title, 
				COUNT(gr.member_id) AS count_members,
				(
					SELECT GROUP_CONCAT(CAST(gm.member_id AS TEXT), ',')
					FROM group_members gm
					WHERE gm.group_id = $1 AND gm.member_id <> $2
				) AS members
			FROM groups g 
			INNER JOIN group_members gr ON g.id = gr.group_id
			WHERE gr.group_id = $1
			GROUP BY g.id, g.title;

	`
	var groupInfo models.Group
	var ids string
	err := r.db.QueryRow(query, GrpID, sessionID).Scan(&groupInfo.ID, &groupInfo.Title, &groupInfo.Count_Members, &ids)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	groupInfo.Members = strings.Split(ids, ",")
	return &groupInfo, nil
}
