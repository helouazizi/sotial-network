package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

func (h *GroupHandler) CreateEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	var event *models.Event
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": "Bad Request",
		})
		return
	}

	event.UserID = r.Context().Value("userID").(int)
	newevent, err := h.service.SaveEvent(r.Context(), event)
	if err.Code != http.StatusOK {
		utils.ResponseJSON(w, err.Code, map[string]any{
			"error": err.Message,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Event created succefully!",
		"data":    newevent,
	})
}

func (h *GroupHandler) GetGroupEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	groupIDStr, errId := utils.GetGroupId(r, "events")
	if errId != nil {
		utils.ResponseJSON(w, http.StatusNotFound, map[string]any{
			"error": errId,
		})
		return
	}
	UserID := r.Context().Value("userID").(int)
	events, err := h.service.GetGroupEvents(UserID, groupIDStr)
	if err.Code != http.StatusOK {
		fmt.Println(err, "err")
		utils.ResponseJSON(w, err.Code, map[string]any{
			"error": err.Message,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": events,
	})
}

func (h *GroupHandler) GetGroupMembersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	groupIDStr, errId := utils.GetGroupId(r, "events")
	if errId != nil {
		utils.ResponseJSON(w, http.StatusNotFound, map[string]any{
			"error": errId,
		})
		return
	}

	events, err := h.service.GetGroupMembers(groupIDStr)
	if err.Code != http.StatusOK {
		utils.ResponseJSON(w, err.Code, map[string]any{
			"error": err.Message,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": events,
	})
}

func (h *GroupHandler) VoteEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	var vote models.EventVote
	if err := json.NewDecoder(r.Body).Decode(&vote); err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": "Bad Reauest",
		})
		return
	}
	vote.UserID = r.Context().Value("userID").(int)
	err := h.service.VoteOnEvent(r.Context(), vote)
	if err.Code != http.StatusOK {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Message,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Event voted succefully!",
	})
}
