package repositories

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

func (r *GroupRepository) SaveEvent(c context.Context, event *models.Event) (models.Event, *models.GroupError) {
	query := `
		INSERT INTO group_events( group_id,  member_id, title, descreption, event_date, created_at) VALUES (?, ?, ?, ?, ?, ?)
	`
	tx, err := r.db.BeginTx(c, nil)
	if err != nil {
		return models.Event{}, &models.GroupError{
			Message: "Internal server eroor",
			Code:    http.StatusInternalServerError,
		}
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	res, err := tx.Exec(query, event.GroupId, event.UserID, event.Title, event.Description, event.EventDate, time.Now())
	if err != nil {
		return models.Event{}, &models.GroupError{
			Message: err.Error(),
			Code:    http.StatusInternalServerError,
		}
	}
	eventID, _ := res.LastInsertId()
	tx.Commit()
	return models.Event{ID: int(eventID)}, &models.GroupError{
		Message: "succefully craetd event",
		Code:    http.StatusOK,
	}
}

func (r *GroupRepository) GetGroupEvents(GroupId int) ([]*models.Event, models.GroupError) {
	query := `
		SELECT 
			e.id, 
			e.title, 
			e.descreption, 
			e.event_date, 
			e.created_at, 
			e.member_id,
			u.first_name,
			u.last_name,
			u.nickname,
			u.avatar
			FROM group_events AS e
			LEFT JOIN users AS u ON u.id = e.member_id
			WHERE e.group_id = ?
			ORDER BY e.created_at DESC;
    `

	rows, err := r.db.Query(query, GroupId)
	if err != nil {
		fmt.Println(err, "1")
		return nil, models.GroupError{
			Message: "Internal Server Error",
			Code:    http.StatusInternalServerError,
		}
	}

	var Events []*models.Event
	for rows.Next() {
		var event models.Event
		var unused int
		err := rows.Scan(
			&event.ID,
			&event.Title,
			&event.Description,
			&event.EventDate,
			&event.CreatedAt,
			&unused,
			&event.Author.FirstName,
			&event.Author.Lastname,
			&event.Author.Nickname,
			&event.Author.Avatar,
		)
		if err != nil {
			fmt.Println(err, "12")
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

func (r *GroupRepository) VoteOnEvent(vote models.EventVote) models.GroupError {
	query := `
		INSERT INTO group_events_votes (event_id, member_id, status)
		VALUES (?, ?, ?)
	`

	_, err := r.db.Exec(query, vote.ID, vote.UserID, vote.Vote)
	if err != nil {
		return models.GroupError{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	return models.GroupError{
		Message: "Successfully voted",
		Code:    http.StatusOK,
	}
}
