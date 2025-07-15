package repositories

import (
	"database/sql"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
)

func (r *GroupRepository) GetInfoGroupeRepo(GrpID string, sessionID int) (*models.Group, error) {
	query := `SELECT 
				g.id, 
				g.title, 
				COUNT(gr.member_id) AS count_members,
				(
					SELECT GROUP_CONCAT(CAST(gm.member_id AS TEXT), ',')
					FROM group_members gm
					WHERE gm.group_id = $1
				) AS members
			FROM groups g 
			INNER JOIN group_members gr ON g.id = gr.group_id
			WHERE gr.group_id = $1
			GROUP BY g.id, g.title;

	`
	var groupInfo models.Group
	var ids sql.NullString
	err := r.db.QueryRow(query, GrpID).Scan(&groupInfo.ID, &groupInfo.Title, &groupInfo.Count_Members, &ids)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if ids.Valid {
		groupInfo.Members = strings.Split(ids.String, ",")
	} else {
		groupInfo.Members = []string{}
	}
	return &groupInfo, nil
}

func (r *GroupRepository) GetGroupMessagesRepo(GrpID string) error {
	query := `SELECT g.id, g.sender_id, g.group_id, u.avatar, CONCAT(u.first_name," ",u.last_name) AS fullName
	FROM group_messages g
	INNER JOIN users u ON u.id=g.sender_id
	WHERE g.group_id=?
	GROUP BY g.group_id;
	ORDER BY g.sent_at DESC
	`
	return nil
}
