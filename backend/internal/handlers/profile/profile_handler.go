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
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	fmt.Println(profile)
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
	if data.To != 1 && data.To != 0 {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad Request",
			"status":  http.StatusBadRequest,
		})
		return
	}
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

func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	sessionID := r.Context().Value("userID").(int)
	errForm := r.ParseMultipartForm(10 << 20)
	if errForm != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid form data",
			"status":  http.StatusBadRequest,
		})
		return
	}

	file, fileHeader, err := r.FormFile("updateImage")
	if err != nil {
		if err != http.ErrMissingFile {
			return
		}
		fileHeader = nil
		file = nil
	}
	if file != nil {
		defer file.Close()
	}
	if err == nil {
		imageType := fileHeader.Header.Get("Content-Type")
		if !(imageType == "image/jpeg" || imageType == "image/png" || imageType == "image/jpg") {
			utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
				"message": "Only .jpeg .png .jpg",
				"status":  http.StatusBadRequest,
			})
			return
		}
	}
	nickname := r.FormValue("nickname")
	about := r.FormValue("about")
	oldAvatar := r.FormValue("oldAvatar")

	NewPath, err := h.service.UpdateProfile(fileHeader, nickname, about, oldAvatar, sessionID)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Failed to update profile.",
			"status":  http.StatusInternalServerError,
		})
		fmt.Println(err)
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Profile Updated successfully",
		"newPath": NewPath,
		"status":  http.StatusOK,
	})
}
