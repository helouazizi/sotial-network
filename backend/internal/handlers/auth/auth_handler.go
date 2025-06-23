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

func (h *UserHandler) CheckAuth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": " you have the token",
		"Code":    http.StatusOK,
	})
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	// Only accept POST
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}

	// Parse multipart form (max 10MB)
	errForm := r.ParseMultipartForm(10 << 20)
	if errForm != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid form data",
			"status":  http.StatusBadRequest,
		})
		return
	}

	// Fill user struct from form values
	user := &models.User{
		Nickname:    r.FormValue("nickname"),
		Email:       r.FormValue("email"),
		PassWord:    r.FormValue("password"),
		FirstName:   r.FormValue("firstname"),
		Lastname:    r.FormValue("lastname"),
		DateofBirth: r.FormValue("dateofbirth"),
		AboutMe:     r.FormValue("aboutme"),
	}
	file, header, errFile := r.FormFile("avatar")
	user.File = file
	user.Header = header
	user.FileErr = errFile
	updateUser, avatarErr := h.service.HundleAvatar(user)
	if avatarErr.Code != http.StatusOK {
		utils.ResponseJSON(w, avatarErr.Code, avatarErr.Message)
		fmt.Println(avatarErr)
		return
	}
	token, err := h.service.SaveUser(&updateUser)
	if err.Code != http.StatusOK {
		utils.ResponseJSON(w, err.Code, err)
		fmt.Println(err)
		return
	}

	// Set auth cookie
	cookie := &http.Cookie{Name: "Token", Value: token, HttpOnly: true, Path: "/", Secure: false}
	http.SetCookie(w, cookie)

	// Respond success
	utils.ResponseJSON(w, err.Code, map[string]any{
		"message": "User registered successfully",
		"Code":    http.StatusOK,
	})
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
