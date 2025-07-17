package services

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

func (s *GroupService) SaveEvent(c context.Context, event *models.Event) (models.Event, *models.GroupError) {
	event.Title = strings.TrimSpace(event.Title)
	event.Description = strings.TrimSpace(event.Description)

	if len([]rune(event.Title)) == 0 {
		return models.Event{}, &models.GroupError{
			Message: "event title is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(event.Description)) == 0 {
		return models.Event{}, &models.GroupError{
			Message: "event description is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(event.Title)) > 300 {
		return models.Event{}, &models.GroupError{
			Message: "event title must not exceed 100 characters",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(event.Description)) > 500 {
		return models.Event{}, &models.GroupError{
			Message: "event description must not exceed 1000 characters",
			Code:    http.StatusBadRequest,
		}
	}
	if event.EventDate.Before(time.Now()) {
		return models.Event{}, &models.GroupError{
			Message: "event date must be in future",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.SaveEvent(c, event)
}

func (s *GroupService) GetGroupEvents(UserId int, groupId string) ([]*models.Event, models.GroupError) {
	GroupId, err := strconv.Atoi(groupId)
	if err != nil && GroupId <=0 {
		return []*models.Event{}, models.GroupError{
			Message: "group id is required",
			Code:    http.StatusNotFound,
		}
	}

	return s.repo.GetGroupEvents(UserId, GroupId)
}

func (s *GroupService) GetGroupMembers(groupId string) (*models.GroupMembers, models.GroupError) {
	GroupId, err := strconv.Atoi(groupId)
	if err != nil &&  GroupId <= 0{
		return &models.GroupMembers{}, models.GroupError{
			Message: "group id is required",
			Code:    http.StatusNotFound,
		}
	}

	return s.repo.GetGroupMembers(GroupId)
}

func (s *GroupService) VoteOnEvent(ctx context.Context, vote models.EventVote) models.GroupError {
	if vote.Vote != "going" && vote.Vote != "not going" && vote.Vote != "remove" {
		return models.GroupError{
			Message: "Bad Request",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.VoteOnEvent(ctx, vote)
}
