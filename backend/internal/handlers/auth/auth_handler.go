package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/auth"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type UserHandler struct {
	service *services.AuthService
}

func NewHandler(AuthService *services.AuthService) *UserHandler {
	return &UserHandler{service: AuthService}
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}

	var user *models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Internal Server Error ",
			"status":  http.StatusInternalServerError,
		})
		return
	}

	err := h.service.SaveUser(user)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Successfully created user",
		"status":  http.StatusOK,
	})
}
