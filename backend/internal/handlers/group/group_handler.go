package group

import (
	"net/http"

	services "github.com/ismailsayen/social-network/internal/services/group"
)

type GroupHandler struct {
	service *services.GroupService
}

func NewGroupHandler(service *services.GroupService) *GroupHandler {
	return &GroupHandler{service: service}
}

func (h *GroupHandler) CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
}
