package handlers

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/chat"
)

type ChatHandler struct {
	service services.ChatService
}

func NewChatHandler(ChatService services.ChatService) *ChatHandler {
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

	userID := 1

	defer func() {
		conn.Close()
		h.service.RemoveClient(userID)
	}()

	h.service.SaveClient(userID, conn)

	for {
		var chat models.Chat
		err := conn.ReadJSON(&chat)
		if err != nil {
			conn.WriteJSON(map[string]any{
				"error": "Error reading message: " + err.Error(),
			})
			return
		}

		chat.SenderID = userID

		err = h.service.SaveMessage(&chat)
		if err != nil {
			conn.WriteJSON(map[string]any{
				"error": err.Error(),
			})
			continue
		}
	}
}
