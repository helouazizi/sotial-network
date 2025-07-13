package repositories

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

func (r *GroupRepository) GetGroup(groupID int) (*models.Group, *models.GroupError) {
	query := `
		SELECT 
			g.id, g.user_id, g.title, g.description, g.created_at,
			u.id, u.nickname, u.first_name, u.last_name,  u.avatar,
			(
               SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id
            ) AS total_members
		FROM groups g
		JOIN users u ON g.user_id = u.id
		WHERE g.id = ?
	`
	group := &models.Group{}
	var gid int
	var uid int
	err := r.db.QueryRow(query, groupID).Scan(
		&gid, &uid, &group.Title, &group.Description, &group.CreatedAt,
		&uid, &group.Author.Nickname, &group.Author.FirstName, &group.Author.Lastname, &group.Author.Avatar, &group.TotalMembers,
	)
	if err != nil {
		return nil, &models.GroupError{
			Message: "Internal Server Error",
			Code:    http.StatusInternalServerError,
		}
	}

	return group, nil
}
