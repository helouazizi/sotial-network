package handlers

import (
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/chat"
)

type ChatHandler struct {
	service *services.ChatService
}

func NewChatHandler(ChatService *services.ChatService) *ChatHandler {
	return &ChatHandler{service: ChatService}
}

// Upgrader is used to upgrade HTTP connections to WebSocket connections.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *ChatHandler) ChatMessagesHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		conn.WriteJSON(map[string]any{
			"error":  "Error upgrading: " + err.Error(),
			"status": http.StatusInternalServerError,
		})
		return
	}

	userID := r.Context().Value("userID").(int)

	defer func() {
		conn.Close()
		h.service.RemoveClient(userID)
	}()

	h.service.SaveClient(userID, conn)

	for {
		var chat models.Chat
		err := conn.ReadJSON(&chat)
		if err != nil && !strings.Contains(err.Error(), "close") {
			conn.WriteJSON(map[string]any{
				"error": "Error reading message: " + err.Error(),
			})
			continue
		}

		if err != nil {
			conn.WriteJSON(map[string]any{
				"error": err.Error(),
			})
			return
		}

		chat.SenderID = userID

		switch chat.Type {
		case "saveMessage":
			lastMessageID, err := h.service.SaveMessage(&chat)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}

			messageData := map[string]any{
				"id":          lastMessageID,
				"receiver_id": chat.ReceiverID,
				"sender_id":   chat.SenderID,
				"message":     chat.Message,
			}

			conn.WriteJSON(map[string]any{
				"message": messageData,
				"type":    "saveMessage",
			})

			if receiverConn, ok := h.service.GetClient(chat.ReceiverID); ok {
				receiverConn.WriteJSON(map[string]any{
					"message": messageData,
					"type":    "saveMessage",
				})
			}

		case "getMessages":
			messages, err := h.service.GetMessages(chat.SenderID, chat.ReceiverID, chat.LastId)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}

			conn.WriteJSON(map[string]any{
				"data": messages,
				"type": "getMessages",
			})
		case "getUser":
			user, err := h.service.GetUser(userID)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}

			conn.WriteJSON(map[string]any{
				"data": user,
				"type": "getUser",
			})
		case "getFriends":
			users, err := h.service.GetFriends(userID)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}

			conn.WriteJSON(map[string]any{
				"data": users,
				"type": "getFriends",
			})
		}
	}
}
