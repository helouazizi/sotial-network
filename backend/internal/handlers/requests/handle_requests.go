package requests

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/services/requests"
)

type RequestHandler struct {
	ReqService *requests.RequestsService
}

func NewRequestHandler(reqS *requests.RequestsService) *RequestHandler {
	return &RequestHandler{ReqService: reqS}
}

func Handle_Reaquests(w http.ResponseWriter, r *http.Request) {
}
