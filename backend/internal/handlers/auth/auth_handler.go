package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/auth"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type UserHandler struct {
	service *services.AuthService
}

func NewAuthHandler(AuthService *services.AuthService) *UserHandler {
	return &UserHandler{service: AuthService}
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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
	if err.UserErrors.HasErro {
		fmt.Println(err)
		utils.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}

	utils.ResponseJSON(w, err.Code, err)
	
}
