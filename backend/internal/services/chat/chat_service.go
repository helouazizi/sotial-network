package services

import (
	"errors"
	"html"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/chat"
)

type ChatService interface {
	SaveMessage(chat *models.Chat) error
	SaveClient(userID int, conn *websocket.Conn)
	RemoveClient(userID int)
}

type ChatServiceImpl struct {
	repo    repositories.ChatRepository
	clients map[int]*websocket.Conn
	mu      sync.Mutex
}

func NewChatService(ChatRepo repositories.ChatRepository) ChatService {
	return &ChatServiceImpl{
		repo:    ChatRepo,
		clients: map[int]*websocket.Conn{},
	}
}

func (s *ChatServiceImpl) SaveMessage(chat *models.Chat) error {
	chat.Message = html.EscapeString(strings.TrimSpace(chat.Message))

	if (chat.SenderID == chat.ReceiverID) {
		return errors.New("Cannot send message to same person")
	}

	if len(chat.Message) == 0 || len([]rune(chat.Message)) > 3000 {
		return errors.New("Message must be between 1 and 3000 characters")
	}

	return s.repo.SaveMessage(chat)
}

func (s *ChatServiceImpl) GetMessages(senderID, receiverID int) {
}

func (s *ChatServiceImpl) SaveClient(userID int, conn *websocket.Conn) {
	defer s.mu.Unlock()
	s.mu.Lock()
	s.clients[len(s.clients)+1] = conn
}

func (s *ChatServiceImpl) RemoveClient(userID int) {
	defer s.mu.Unlock()
	s.mu.Lock()
	delete(s.clients, userID)
}
