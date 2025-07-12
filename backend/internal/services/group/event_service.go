package services

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
)

func (s *GroupService) SaveEvent(event *models.Event) *models.GroupError {
	event.Title = strings.TrimSpace(event.Title)
	event.Description = strings.TrimSpace(event.Description)

	if len([]rune(event.Title)) == 0 {
		return &models.GroupError{
			Message: "group title is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(event.Description)) == 0 {
		return &models.GroupError{
			Message: "group description is required",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(event.Title)) > 100 {
		return &models.GroupError{
			Message: "group title must not exceed 100 characters",
			Code:    http.StatusBadRequest,
		}
	}

	if len([]rune(event.Description)) > 1000 {
		return &models.GroupError{
			Message: "group description must not exceed 1000 characters",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.SaveEvent(event)
}

func (s *GroupService) GetGroupEvents(groupId string) ([]*models.Event, models.GroupError) {
	GroupId, err := strconv.Atoi(groupId)
	if err != nil {
		return []*models.Event{}, models.GroupError{
			Message: "group id is required",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.GetGroupEvents(GroupId)
}

func (s *GroupService) VoteOnEvent(vote models.EventVote) models.GroupError {
	if vote.Vote != "going" && vote.Vote != "not going" {
		return models.GroupError{
			Message: "Bad Request",
			Code:    http.StatusBadRequest,
		}
	}

	return s.repo.VoteOnEvent(vote)
}
