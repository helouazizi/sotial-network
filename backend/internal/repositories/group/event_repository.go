package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

func (r *GroupRepository) SaveEvent(c context.Context, event *models.Event) (models.Event, *models.GroupError) {
	query := `
		INSERT INTO group_events( group_id,  member_id, title, descreption, event_date, created_at,total_going, total_not_going) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

	res, err := tx.Exec(query, event.GroupId, event.UserID, event.Title, event.Description, event.EventDate, time.Now(), 0, 0)
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

func (r *GroupRepository) GetGroupEvents(userID, groupID int) ([]*models.Event, models.GroupError) {
	query := `
		SELECT 
			e.id, 
			e.title, 
			e.descreption, 
			e.event_date, 
			e.created_at,
			e.total_going,
			e.total_not_going, 
			ev.status,
			u.id,
			u.first_name,
			u.last_name,
			u.nickname,
			u.avatar
		FROM group_events AS e
		LEFT JOIN group_events_votes ev 
			ON ev.event_id = e.id AND ev.member_id = $1
		INNER JOIN users AS u 
			ON u.id = e.member_id
		WHERE e.group_id = $2
		ORDER BY e.created_at DESC;
	`

	rows, err := r.db.Query(query, userID, groupID)
	if err != nil {
		fmt.Println(err, "err")
		return nil, models.GroupError{
			Message: "Internal Server Error",
			Code:    http.StatusInternalServerError,
		}
	}
	defer rows.Close()

	var events []*models.Event
	var unused int

	for rows.Next() {
		var event models.Event
		var vote sql.NullString
		err := rows.Scan(
			&event.ID,
			&event.Title,
			&event.Description,
			&event.EventDate,
			&event.CreatedAt,
			&event.TotalGoing,
			&event.TotalNotGoing,
			&vote,
			&unused,
			&event.Author.FirstName,
			&event.Author.Lastname,
			&event.Author.Nickname,
			&event.Author.Avatar,
		)
		if err != nil {
			fmt.Println(err, "err1")
			return nil, models.GroupError{
				Message: "Internal Server Error",
				Code:    http.StatusInternalServerError,
			}
		}
		event.UserVote = vote.String

		events = append(events, &event)
	}

	if err := rows.Err(); err != nil {
		return nil, models.GroupError{
			Message: "Internal Server Error",
			Code:    http.StatusInternalServerError,
		}
	}

	return events, models.GroupError{
		Message: "Successfully fetched events",
		Code:    http.StatusOK,
	}
}

func (r *GroupRepository) VoteOnEvent(ctx context.Context, vote models.EventVote) models.GroupError {
	query := `
		INSERT INTO group_events_votes (event_id, member_id, status)
		VALUES (?, ?, ?)
	`

	_, err := r.db.ExecContext(ctx, query, vote.ID, vote.UserID, vote.Vote)
	if err != nil {
		return models.GroupError{
			Message: "Failed to cast vote",
			Code:    http.StatusInternalServerError,
		}
	}

	return models.GroupError{
		Message: "Vote registered successfully",
		Code:    http.StatusOK,
	}
}
