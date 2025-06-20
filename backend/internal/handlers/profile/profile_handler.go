package profile

import (
	"fmt"
	"net/http"

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
	ID := r.Context().Value("userID").(int)
	fmt.Println(ID)
}
