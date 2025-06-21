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

	token, err := h.service.SaveUser(user)
	if err.UserErrors.HasErro {
		utils.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}
	cookie := &http.Cookie{Name: "Token", Value: token, HttpOnly: true, Path: "/", Secure: false}
	http.SetCookie(w, cookie)

	utils.ResponseJSON(w, err.Code, err)
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
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
			"message": "Internal Server Error",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	token, errLog := h.service.LogUser(user)
	fmt.Println(errLog)

	if errLog.Code != http.StatusOK {
		utils.ResponseJSON(w, errLog.Code, errLog)
		return
	}
	cookie := &http.Cookie{
		Name:     "Token",
		Value:    token,
		HttpOnly: true,
		Path:     "/",
		Secure:   false, // Because no HTTPS on localhost
	}

	http.SetCookie(w, cookie)

	utils.ResponseJSON(w, errLog.Code, errLog)
}
