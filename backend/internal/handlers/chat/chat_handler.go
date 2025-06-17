package handlers

import (
	"net/http"

	"github.com/gorilla/websocket"
	services "github.com/ismailsayen/social-network/internal/services/chat"
)

type ChatHandler struct {
	service *services.ChatService
}

// Upgrader is used to upgrade HTTP connections to WebSocket connections.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
