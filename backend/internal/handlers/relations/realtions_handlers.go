package relations

import (
	"net/http"

	services "github.com/ismailsayen/social-network/internal/services/relations"
)

type RelationsHandler struct {
	RelationsServices *services.RelationsServices
}

func NewRelationsHandler(rs *services.RelationsServices) *RelationsHandler {
	return &RelationsHandler{RelationsServices: rs}
}

func (h *RelationsHandler) RelationHandler(w http.ResponseWriter, r *http.Request) {
}
