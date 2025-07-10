package repositories

import (
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

func (r *GroupRepository) SaveEvent(event *models.Event) *models.GroupError {
	query := `
		INSERT INTO group_events( group_id,  member_id, title, descreption, event_date, created_at) VALUES (?, ?, ?, ?, ?, ?)
	`
	_, err := r.db.Exec(query, event.GroupId, event.UserID, event.Title, event.Description, event.EventDate, time.Now())
	if err != nil {
		return &models.GroupError{
			Message: err.Error(),
			Code:    http.StatusInternalServerError,
		}
	}

	return nil
}

func (r *GroupRepository) GetGroupEvents(GroupId int) ([]*models.Event, models.GroupError) {
	query := `
	SELECT id, title, descreption, event_date, created_at
	FROM group_events
	WHERE group_id = ?
`

	rows, err := r.db.Query(query, GroupId)
	if err != nil {
		return nil, models.GroupError{
			Message: "Internal Server Error",
			Code:    http.StatusInternalServerError,
		}
	}

	var Events []*models.Event
	for rows.Next() {
		var event models.Event
		err := rows.Scan(&event.ID, &event.Title, &event.Description, &event.EventDate, &event.CreatedAt)
		if err != nil {
			return nil, models.GroupError{
				Message: "Internal Server Error",
				Code:    http.StatusInternalServerError,
			}
		}

		Events = append(Events, &event)
	}

	return Events, models.GroupError{
		Message: "Succesfuly fetched events",
		Code:    http.StatusOK,
	}
}
