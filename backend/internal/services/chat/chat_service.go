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

type ChatService struct {
	repo    *repositories.ChatRepository
	clients map[int]*websocket.Conn
	mu      sync.Mutex
}

func NewChatService(ChatRepo *repositories.ChatRepository) *ChatService {
	return &ChatService{
		repo:    ChatRepo,
		clients: map[int]*websocket.Conn{},
	}
}

func (s *ChatService) SaveMessage(chat *models.Chat) error {
	chat.Message = html.EscapeString(strings.TrimSpace(chat.Message))

	if chat.SenderID == chat.ReceiverID {
		return errors.New("Cannot send message to same person")
	}

	if len(chat.Message) == 0 || len([]rune(chat.Message)) > 3000 {
		return errors.New("Message must be between 1 and 3000 characters")
	}

	return s.repo.SaveMessage(chat)
}

func (s *ChatService) GetMessages(senderID, receiverID int) ([]*models.Chat, error) {
	if senderID == receiverID {
		return nil, errors.New("cannot get messages with yourself")
	}

	return s.repo.GetMessages(senderID, receiverID)
}

func (s *ChatService) SaveClient(userID int, conn *websocket.Conn) {
	defer s.mu.Unlock()
	s.mu.Lock()
	s.clients[len(s.clients)+1] = conn
}

func (s *ChatService) RemoveClient(userID int) {
	defer s.mu.Unlock()
	s.mu.Lock()
	delete(s.clients, userID)
}

func (s *ChatService) GetUser(userID int) (*models.User, error) {
	return s.repo.GetUser(userID)
}

func (s *ChatService) GetFriends(userID int) ([]*models.User, error) {
	return s.repo.GetFriends(userID)
}