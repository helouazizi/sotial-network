package profile

import (
	"net/http"
	"strconv"

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
	if sessionID == userID {
		
	}
}
