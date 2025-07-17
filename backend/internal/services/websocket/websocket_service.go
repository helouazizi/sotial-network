package services

import (
	"errors"
	"html"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/websocket"
)

type WebsocketService struct {
	repo    *repositories.WebsocketRepository
	clients map[int][]*websocket.Conn
	mu      sync.Mutex
}

func NewWebsocketService(WebsocketRepo *repositories.WebsocketRepository) *WebsocketService {
	return &WebsocketService{
		repo:    WebsocketRepo,
		clients: map[int][]*websocket.Conn{},
	}
}

func (s *WebsocketService) SaveMessage(chat *models.WS) (int, error) {
	chat.Message = html.EscapeString(strings.TrimSpace(chat.Message))

	if chat.SenderID == chat.ReceiverID {
		return 0, errors.New("Cannot send message to same person")
	}

	if len(chat.Message) == 0 || len([]rune(chat.Message)) > 3000 {
		return 0, errors.New("Message must be between 1 and 3000 characters")
	}

	return s.repo.SaveMessage(chat)
}

func (s *WebsocketService) GetMessages(senderID, receiverID int, lastID int) ([]*models.WS, error) {
	if senderID == receiverID {
		return nil, errors.New("cannot get messages with yourself")
	}

	return s.repo.GetMessages(senderID, receiverID, lastID)
}

func (s *WebsocketService) SaveClient(userID int, conn *websocket.Conn) {
	defer s.mu.Unlock()
	s.mu.Lock()
	s.clients[userID] = append(s.clients[userID], conn)
}

func (s *WebsocketService) RemoveClient(userID int, closedConn *websocket.Conn) {
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

func (s *WebsocketService) GetClient(id int) ([]*websocket.Conn, bool) {
	defer s.mu.Unlock()
	s.mu.Lock()
	conn, ok := s.clients[id]
	return conn, ok
}

func (s *WebsocketService) GetLastMessageID() (int, error) {
	return s.repo.GetLastMessageID()
}

func (reqSer *WebsocketService) NumberNotifs(sessionID int) (int, int, error) {
	return reqSer.repo.CountNotiif(sessionID)
}

func (reqSer *WebsocketService) GetRequestFollowers(sessionID int) ([]models.CommunInfoProfile, error) {
	return reqSer.repo.RequestFollowers(sessionID)
}

func (reqSer *WebsocketService) HandleFollowReq(reqID, followedID, followerID int, action string) error {
	var newStatus string
	switch action {
	case "accept":
		newStatus = "accepted"
	case "reject":
		newStatus = "follow"
	}
	return reqSer.repo.HandleReqFollowRepo(reqID, followedID, followerID, newStatus)
}

func (reqSer *WebsocketService) SaveMessagesGrp(idGrp, senderId int, message, avatar, fullName string, sentAt *time.Time) (map[string]any, error) {
	return reqSer.repo.SaveMessagesGrpRepo(idGrp, senderId, message, avatar, fullName, sentAt)
}

func (s *WebsocketService) HandleGroupRequest(request *models.WS, userId int) ([]int, error) {
	return s.repo.HandleGroupRequest(request, userId)
}

func (s *WebsocketService) GetGroupNotifs(requestedID int) ([]*models.GroupRequest, error) {
	return s.repo.GetGroupNotifs(requestedID)
}