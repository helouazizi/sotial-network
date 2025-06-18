package handlers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/chat"
	"github.com/ismailsayen/social-network/pkg/utils"
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
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error upgrading: " + err.Error(),
			"status":  http.StatusInternalServerError,
		})
		return
	}
	defer conn.Close()

	
	var chat models.Chat

	for {
		err := conn.ReadJSON(&chat)
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}

		
	}
}
