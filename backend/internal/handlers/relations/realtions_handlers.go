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
	err = h.RelationsServices.CheckRelation(&data, sessionID)
	if err != nil {
		return
	}
}
