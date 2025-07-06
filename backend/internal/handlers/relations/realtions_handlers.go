package relations

import (
	"encoding/json"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/relations"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type RelationsHandler struct {
	RelationsServices *services.RelationsServices
}

func NewRelationsHandler(rs *services.RelationsServices) *RelationsHandler {
	return &RelationsHandler{RelationsServices: rs}
}

func (h *RelationsHandler) RelationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	sessionID := r.Context().Value("userID").(int)
	var data models.RealtionUpdate
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	if sessionID == data.ProfileID {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid Request Data.",
			"status":  http.StatusInternalServerError,
		})
		return
	}

	NewRelation, err := h.RelationsServices.CheckRelation(&data, sessionID)
	if err != nil && err.Error() == "Invalid Request Data" {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid Request Data.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message":     "Request sended successfully",
		"NewRelation": NewRelation,
		"status":      http.StatusOK,
	})
}

func (h *RelationsHandler) GetRelations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	var data models.GetUsers
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	if data.Type != "followers" && data.Type != "followed" {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid Request Data.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	usersData, err := h.RelationsServices.GetRealtionsServives(&data)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message":     "Profile Updated successfully",
		"NewRelation": usersData,
		"status":      http.StatusOK,
	})
}
