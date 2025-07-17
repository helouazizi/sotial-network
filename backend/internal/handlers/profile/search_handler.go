package profile

import (
	"net/http"
	"strings"

	"github.com/ismailsayen/social-network/pkg/utils"
)

func (h *ProfileHandler) SearchProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	query := strings.TrimSpace(r.URL.Query().Get("message"))
	if query == "" {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Search query is required",
			"status":  http.StatusBadRequest,
		})
		return
	}
	users, err := h.service.SearchProfile(query)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Internal Server Error",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": users,
		"status":  http.StatusOK,
	})
}
