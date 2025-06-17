package services

import (
	"fmt"
	"html"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/chat"
)

type ChatService struct {
	repo *repositories.ChatRepository
}

func NewChatService(ChatRepo *repositories.ChatRepository) *ChatService {
	return &ChatService{repo: ChatRepo}
}

func (s *ChatService) SaveMessage(chat *models.Chat) error {
	chat.Message = html.EscapeString(strings.TrimSpace(chat.Message))

	if (len(chat.Message) == 0 || len([]rune(chat.Message)) > 3000) {
		return fmt.Errorf("Invalid msg")
	}



	return nil
}