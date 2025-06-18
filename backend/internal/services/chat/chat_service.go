package services

import (
	"fmt"
	"html"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/chat"
)

type ChatService struct {
	repo    *repositories.ChatRepository
	clients map[int]*websocket.Conn
	mu      sync.Mutex
}

func NewChatService(ChatRepo *repositories.ChatRepository) *ChatService {
	return &ChatService{repo: ChatRepo}
}

func (s *ChatService) SaveMessage(chat *models.Chat) error {
	chat.Message = html.EscapeString(strings.TrimSpace(chat.Message))

	if len(chat.Message) == 0 || len([]rune(chat.Message)) > 3000 {
		return fmt.Errorf("Invalid msg")
	}

	return nil
}

func (s *ChatService) SaveClient(userID int, conn *websocket.Conn) {
	defer s.mu.Unlock()
	s.mu.Lock()
	s.clients[userID] = conn
}

func (s *ChatService) RemoveClient(userID int) {
	defer s.mu.Unlock()
	s.mu.Lock()
	delete(s.clients, userID)
}
