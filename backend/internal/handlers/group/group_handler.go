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

func (h *GroupHandler) GetGroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	GroupID, err := utils.GetGroupId(r, "events")
	if err != nil {
		utils.ResponseJSON(w, http.StatusNotFound, map[string]any{
			"error": "Invalid Url",
		})
		return
	}

	groupinfo, errr := h.service.GetGroup(GroupID)

	if errr != nil {
		utils.ResponseJSON(w, errr.Code, map[string]any{
			"error": errr.Message,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": groupinfo,
	})
}

func (h *GroupHandler) JoinGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	var groupRequest *models.GroupRequest
	if err := json.NewDecoder(r.Body).Decode(&groupRequest); err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
	}

	groupRequest.SenderID = r.Context().Value("userID").(int)

	reqID, err := h.service.SaveJoinGroupRequest(groupRequest)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Request sended succesfully!",
		"request_id": reqID,
	})
}

func (h *GroupHandler) CancelGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	var groupRequest *models.GroupRequest
	if err := json.NewDecoder(r.Body).Decode(&groupRequest); err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
	}

	err := h.service.CancelGroupRequest(groupRequest.ID)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Request Cancled succesfully!",
	})
}

func (h *GroupHandler) GetGroupNotifsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"error": "Method not allowed",
		})
		return
	}

	requestedID := r.Context().Value("userID").(int)

	groupNotifs, err := h.service.GetGroupNotifs(requestedID)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"error": err.Error(),
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"data": groupNotifs,
	})
}
