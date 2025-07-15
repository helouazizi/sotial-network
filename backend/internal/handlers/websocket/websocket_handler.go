package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/websocket"
)

type WebsocketHandler struct {
	service *services.WebsocketService
}

func NewWebsocketHandler(WebsocketService *services.WebsocketService) *WebsocketHandler {
	return &WebsocketHandler{service: WebsocketService}
}

// Upgrader is used to upgrade HTTP connections to WebSocket connections.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *WebsocketHandler) WebsocketHandler(w http.ResponseWriter, r *http.Request) {
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
		h.service.RemoveClient(userID, conn)
	}()

	h.service.SaveClient(userID, conn)

	for {
		var ws models.WS
		err := conn.ReadJSON(&ws)
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

		ws.SenderID = userID

		switch ws.Type {
		case "saveMessage":
			lastMessageID, err := h.service.SaveMessage(&ws)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}

			messageData := map[string]any{
				"id":          lastMessageID,
				"receiver_id": ws.ReceiverID,
				"sender_id":   ws.SenderID,
				"message":     ws.Message,
				"sent_at_str": time.Now().Format(time.DateTime),
			}

			if senderConns, ok := h.service.GetClient(ws.SenderID); ok {
				for _, c := range senderConns {
					c.WriteJSON(map[string]any{
						"message": messageData,
						"type":    "saveMessage",
					})
				}
			}

			if receiverConns, ok := h.service.GetClient(ws.ReceiverID); ok {
				for _, c := range receiverConns {
					c.WriteJSON(map[string]any{
						"message": messageData,
						"type":    "saveMessage",
					})
				}
			}

		case "getMessages":
			if ws.LastId == -1 {
				ws.LastId, err = h.service.GetLastMessageID()
				if err != nil {
					conn.WriteJSON(map[string]any{
						"error": err.Error(),
					})
					continue
				}
			}

			messages, err := h.service.GetMessages(ws.SenderID, ws.ReceiverID, ws.LastId)
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
		case "GetNumNotif":
			groupeCount, followersCount, err := h.service.NumberNotifs(ws.SenderID)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}
			CountNotis := map[string]any{
				"groupeCount":    groupeCount,
				"followersCount": followersCount,
				"total":          followersCount + groupeCount,
			}
			conn.WriteJSON(map[string]any{
				"data": CountNotis,
				"type": "CountNotifs",
			})
		case "GetFollowersRequest":
			followers, err := h.service.GetRequestFollowers(ws.SenderID)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}
			conn.WriteJSON(map[string]any{
				"data": followers,
				"type": "requestsFollowers",
			})
		case "HandleRequest":
			err = h.service.HandleFollowReq(ws.ID, ws.SenderID, ws.ReceiverID, ws.Action)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}
			if senderConns, ok := h.service.GetClient(ws.SenderID); ok {
				for _, c := range senderConns {
					c.WriteJSON(map[string]any{
						"ReqID": ws.ID,
						"type":  "ResponseRequestsFollowers",
					})
				}
			}
		case "RelationSended", "CancelRequest":
			followers, err := h.service.GetRequestFollowers(ws.ReceiverID)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}
			groupeCount, followersCount, err := h.service.NumberNotifs(ws.ReceiverID)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}
			CountNotis := map[string]any{
				"groupeCount":    groupeCount,
				"followersCount": followersCount,
				"total":          followersCount + groupeCount,
			}
			if senderConns, ok := h.service.GetClient(ws.ReceiverID); ok {
				for _, c := range senderConns {
					c.WriteJSON(map[string]any{
						"data": followers,
						"type": "requestsFollowers",
					})
					c.WriteJSON(map[string]any{
						"data": CountNotis,
						"type": "CountNotifs",
					})
				}
			}
			if ws.Action == "demandFollow" {
				if senderConns, ok := h.service.GetClient(ws.ReceiverID); ok {
					for _, c := range senderConns {
						c.WriteJSON(map[string]any{
							"message": ws.Message,
							"type":    "showNotif",
						})
					}
				}
			}
		case "saveMessageGroup":
			ws.SentAt = time.Now()
			lastMsg, err := h.service.SaveMessagesGrp(ws.ID, ws.SenderID, ws.Message, ws.Avatar, ws.FullName, &ws.SentAt)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}
			for _, id := range ws.Members {
				if senderConns, ok := h.service.GetClient(id); ok {
					for _, c := range senderConns {
						c.WriteJSON(map[string]any{
							"message": lastMsg,
							"type":    "NewMsgGrp",
						})
					}
				}
			}
		case "handleGroupReq":
			err := h.service.HandleGroupRequest(&ws)
			if err != nil {
				conn.WriteJSON(map[string]any{
					"error": err.Error(),
				})
				continue
			}

		}
	}
}
