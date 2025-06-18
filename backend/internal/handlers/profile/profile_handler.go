package profile

import (
	"fmt"
	"net/http"

	services "github.com/ismailsayen/social-network/internal/services/profile"
)

type ProfileHandler struct {
	service *services.ProfileService
}

func NewProfileHandler(service *services.ProfileService) *ProfileHandler {
	return &ProfileHandler{service: service}
}

func (h *ProfileHandler) ProfileHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("im here finally")
}
