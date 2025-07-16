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
		SELECT 
    g.*,
    CASE 
        WHEN gr.id IS NOT NULL THEN gr.id
        ELSE 0
    END AS request_id
	FROM groups g
	LEFT JOIN group_requests gr
		ON gr.group_id = g.id 
		AND gr.sender_id = ? 
		AND gr.type = 'demande'
	WHERE g.id NOT IN (
		SELECT gm.group_id 
		FROM group_members gm
		WHERE gm.member_id = ?
	)
	ORDER BY g.id DESC;
	`

	rows, err := r.db.Query(query, userID, userID)
	if err != nil {
		return nil, err
	}

	var groups []*models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(&group.ID, &group.UserID, &group.Title, &group.Description, &group.CreatedAt, &group.RequestID)
		if err != nil {
			return nil, err
		}

		groups = append(groups, &group)
	}

	return groups, nil
}

func (r *GroupRepository) GetGroup(groupID int) (models.GroupIfo, *models.GroupError) {
	query := `
		SELECT 
			g.id, g.title, g.description, g.created_at,
			u.id, u.nickname, u.first_name, u.last_name, u.avatar,
			(
				SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id
			) AS total_members
		FROM groups g
		JOIN users u ON g.user_id = u.id
		WHERE g.id = ?
	`

	groupInfo := models.GroupIfo{}
	var nickname sql.NullString

	err := r.db.QueryRow(query, groupID).Scan(
		&groupInfo.Group.ID,
		&groupInfo.Group.Title,
		&groupInfo.Group.Description,
		&groupInfo.Group.CreatedAt,
		&groupInfo.Author.ID,
		&nickname,
		&groupInfo.Author.FirstName,
		&groupInfo.Author.Lastname,
		&groupInfo.Author.Avatar,
		&groupInfo.TotalMembers,
	)
	if err != nil {
		return models.GroupIfo{}, &models.GroupError{
			Message: "Internal Server Error",
			Code:    http.StatusInternalServerError,
		}
	}
	groupInfo.Author.Nickname = nickname.String

	return groupInfo, nil
}

func (r *GroupRepository) SaveJoinGroupRequest(groupReq *models.GroupRequest) ([]int, error) {
	query := `
		INSERT INTO group_requests (group_id, requested_id, sender_id, type) VALUES (?,?,?,?) RETURNING id
	`

	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}

	stmt, err := tx.Prepare(query)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	defer stmt.Close()

	ids := []int{}
	for _, requestedID := range groupReq.RequestedID {
		var id int
		err := stmt.QueryRow(groupReq.GroupID, requestedID, groupReq.SenderID, groupReq.Type).Scan(&id)
		if err != nil && err != sql.ErrNoRows {
			tx.Rollback()
			return nil, err
		}

		ids = append(ids, id)
	}

	return ids, tx.Commit()
}

func (r *GroupRepository) GetGroupNotifs(requestedID int) ([]*models.GroupRequest, error) {
	query := `
		select u.id, u.first_name, u.last_name, u.avatar, rq.id,rq.group_id, rq.sender_id, rq.type  from users u 
		inner join group_requests rq ON u.id = rq.sender_id 
		where rq.requested_id = ?
		ORDER BY rq.id DESC;
	`

	rows, err := r.db.Query(query, requestedID)
	if err != nil {
		return nil, err
	}

	var groupNotifs []*models.GroupRequest
	for rows.Next() {
		var groupNotif models.GroupRequest
		var user models.User
		err = rows.Scan(&user.ID, &user.FirstName, &user.Lastname,
			&user.Avatar, &groupNotif.ID, &groupNotif.GroupID, &groupNotif.SenderID, &groupNotif.Type)
		if err != nil {
			return nil, err
		}

		groupNotif.UserInfos = &user

		groupNotifs = append(groupNotifs, &groupNotif)
	}

	return groupNotifs, nil
}

func (r *GroupRepository) CancelGroupRequest(id int) error {
	query := `
		DELETE FROM group_requests WHERE id = ?; 
	`

	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
