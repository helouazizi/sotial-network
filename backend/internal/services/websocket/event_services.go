package services

import (
	"errors"

	"github.com/ismailsayen/social-network/internal/models"
)

func (s *WebsocketService) GreMembersIds(chat *models.WS) ([]*int, error) {
	if chat.ID <= 0 {
		return []*int{}, errors.New("group id is not valid")
	}

	if chat.SenderID <= 0 {
		return []*int{}, errors.New("sender id is not valid ")
	}

	return s.repo.GetMembersIDs(chat)
}
