package services

import (
	"errors"
	"html"
	"slices"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/chat"
)

type ChatService struct {
	repo    *repositories.ChatRepository
	clients map[int][]*websocket.Conn
	mu      sync.Mutex
}

func NewChatService(ChatRepo *repositories.ChatRepository) *ChatService {
	return &ChatService{
		repo:    ChatRepo,
		clients: map[int][]*websocket.Conn{},
	}
}

func (s *ChatService) SaveMessage(chat *models.Chat) (int, error) {
	chat.Message = html.EscapeString(strings.TrimSpace(chat.Message))

	if chat.SenderID == chat.ReceiverID {
		return 0, errors.New("Cannot send message to same person")
	}

	if len(chat.Message) == 0 || len([]rune(chat.Message)) > 3000 {
		return 0, errors.New("Message must be between 1 and 3000 characters")
	}

	return s.repo.SaveMessage(chat)
}

func (s *ChatService) GetMessages(senderID, receiverID int, lastID int) ([]*models.Chat, error) {
	if senderID == receiverID {
		return nil, errors.New("cannot get messages with yourself")
	}

	return s.repo.GetMessages(senderID, receiverID, lastID)
}

func (s *ChatService) SaveClient(userID int, conn *websocket.Conn) {
	defer s.mu.Unlock()
	s.mu.Lock()
	s.clients[userID] = append(s.clients[userID], conn)
}

func (s *ChatService) RemoveClient(userID int, closedConn *websocket.Conn) {
	defer s.mu.Unlock()
	s.mu.Lock()

	for i, conn := range s.clients[userID] {
		if conn == closedConn {
			s.clients[userID] = slices.Delete(s.clients[userID], i, i+1)
			break
		}
	}

	if len(s.clients[userID]) == 0 {
		delete(s.clients, userID)
	}
}

func (s *ChatService) GetFriends(userID int) ([]*models.User, error) {
	return s.repo.GetFriends(userID)
}

func (s *ChatService) GetClient(id int) ([]*websocket.Conn, bool) {
	defer s.mu.Unlock()
	s.mu.Lock()
	conn, ok := s.clients[id]
	return conn, ok
}

func (s *ChatService) GetLastMessageID() (int, error) {
	return s.repo.GetLastMessageID()
}

func (reqSer *ChatService) NumberNotifs(sessionID int) (int, int, error) {
	return reqSer.repo.CountNotiif(sessionID)
}
