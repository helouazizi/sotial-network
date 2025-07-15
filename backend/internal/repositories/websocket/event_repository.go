package repositories

import (
	"github.com/ismailsayen/social-network/internal/models"
)

func (r *WebsocketRepository) GetMembersIDs(chat *models.WS) ([]*int, error) {
	query := `
	SELECT DISTINCT member_id 
	FROM group_members 
	WHERE group_id = ?
`
	rows, err := r.db.Query(query, chat.ID)
	if err != nil {
		return []*int{}, err
	}
	ids := []*int{}
	for rows.Next() {
		var id int
		err = rows.Scan(&id)
		if err != nil {
			return nil, err
		}
		ids = append(ids, &id)
	}
	return ids, nil
}
