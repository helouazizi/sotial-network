package profile

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/profile"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type ProfileHandler struct {
	service *services.ProfileService
}

func NewProfileHandler(service *services.ProfileService) *ProfileHandler {
	return &ProfileHandler{service: service}
}

func (h *ProfileHandler) ProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	sessionID := r.Context().Value("userID").(int)
	query := r.URL.Query().Get("id")
	userID, err := strconv.Atoi(query)
	if err != nil {
		utils.ResponseJSON(w, http.StatusNotFound, map[string]any{
			"message": "Profile Not Found",
			"status":  http.StatusNotFound,
		})
		return
	}
	profile, err := h.service.GetProfile(sessionID, userID)
	if err == sql.ErrNoRows {
		utils.ResponseJSON(w, http.StatusNotFound, map[string]any{
			"message": "Profile Not Found",
			"status":  http.StatusNotFound,
		})
		return
	}
	if err != nil {
		fmt.Println(err)
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, profile)
}

func (h *ProfileHandler) ChangeVisbility(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	var data models.UpdateVsibility
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Server Error",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	fmt.Println(data, data.To)
	sessionID := r.Context().Value("userID").(int)
	err = h.service.ChangeVisbility(sessionID, data.To)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Server Error",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Visibilty Updated successfully",
		"status":  http.StatusOK,
	})
}
