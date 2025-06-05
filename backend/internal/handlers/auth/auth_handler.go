package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type UserHandler struct {
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request){
	if r.Method != http.MethodGet {
	    utils.ResponseJSON(w,http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status" : http.StatusMethodNotAllowed,
		})
		return
	}
	var user *models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.ResponseJSON(w , http.StatusInternalServerError,map[string]any{
			"message": "Internal Server Error ",
			"status" :http.StatusInternalServerError ,
		})
		return 
	}
	


}
