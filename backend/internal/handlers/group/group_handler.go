package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/group"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type GroupHandler struct {
	service *services.GroupService
}

func NewGroupHandler(service *services.GroupService) *GroupHandler {
	return &GroupHandler{service: service}
}

func (h *GroupHandler) CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	var group *models.Group
	if err := json.NewDecoder(r.Body).Decode(&group); err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}

	group.UserID = r.Context().Value("userID").(int)

	id, err := h.service.SaveGroup(group)
	if err != nil {
		utils.ResponseJSON(w, err.Code, map[string]any{
			"error": err.Message,
		})
		return
	}

	data := models.Group{
		ID:          id,
		UserID:      group.UserID,
		Title:       group.Title,
		Description: group.Description,
		CreatedAt:   time.Now(),
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data":    data,
		"message": "Group created succefully!",
	})
}

func (h *GroupHandler) GetJoinedGroupsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	userID := r.Context().Value("userID").(int)

	groups, err := h.service.GetJoinedGroups(userID)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": groups,
	})
}

func (h *GroupHandler) GetSuggestedGroupsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	userID := r.Context().Value("userID").(int)

	groups, err := h.service.GetSuggestedGroups(userID)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": groups,
	})
}

func (h *GroupHandler) GetInfoGroupe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}
	groupId := r.URL.Query().Get("group_id")
	infoGrp, err := h.service.GetInfoGroupeService(groupId)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": infoGrp,
	})
}
