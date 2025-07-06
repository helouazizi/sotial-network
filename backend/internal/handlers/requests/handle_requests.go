package requests

import (
	"fmt"
	"net/http"

	"github.com/ismailsayen/social-network/internal/services/requests"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type RequestHandler struct {
	ReqService *requests.RequestsService
}

func NewRequestHandler(reqS *requests.RequestsService) *RequestHandler {
	return &RequestHandler{ReqService: reqS}
}

func (reqHdlr *RequestHandler) Handle_Reaquests(w http.ResponseWriter, r *http.Request) {
}

func (reqHdlr *RequestHandler) GetNumOFReq(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	sessionID := r.Context().Value("userID").(int)

	groupeReqCount, followersCount, err := reqHdlr.ReqService.NumberOfRequests(sessionID)
	fmt.Println(groupeReqCount, followersCount, "=>", err)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Error, please try again.",
			"status":  http.StatusInternalServerError,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"groupeReqCount": groupeReqCount,
		"followersCount": followersCount,
		"total":          followersCount + groupeReqCount,
	})
}
