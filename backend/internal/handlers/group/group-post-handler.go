package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/utils"
)

const maxUpload = 10 << 20

func (h *GroupHandler) AddGroupPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	userId := r.Context().Value("userID").(int)

	r.Body = http.MaxBytesReader(w, r.Body, maxUpload)
	err := r.ParseMultipartForm(maxUpload)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad Request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	groupIdstr, groupErr := utils.GetGroupId(r, "post")
	if groupErr != nil {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Invalid URL",
			"status":  http.StatusBadRequest,
		})
		return
	}
	groupId, err := strconv.Atoi(groupIdstr)
	if err != nil {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Internal Server Error",
			"status":  http.StatusInternalServerError,
		})
		return
	}

	post := &models.GroupPost{
		GroupId: groupId,
		Post: models.Post{
			ID:      userId,
			Title:   r.FormValue("title"),
			Content: r.FormValue("content"),
		},
	}

	file, header, err := r.FormFile("image")

	var img *models.Image // nil unless file is provided
	if err == nil {
		img = &models.Image{
			ImgHeader:  header,
			ImgContent: file,
		}

		defer file.Close()
	}
	savepost, ErrSavePost := h.service.SaveGroupePost(r.Context(), post, img)
	if ErrSavePost.Code != http.StatusOK {
		utils.ResponseJSON(w, ErrSavePost.Code, ErrSavePost)
		return
	}

	utils.ResponseJSON(w, http.StatusOK, savepost)
}

func (h *GroupHandler) GetGroupPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}

	defer r.Body.Close()

	var req models.PaginationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid JSON payload",
			"status":  http.StatusBadRequest,
		})
		return
	}
	groupIdstr, groupErr := utils.GetGroupId(r, "post")
	if groupErr != nil {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Invalid URL",
			"status":  http.StatusBadRequest,
		})
		return
	}
	posts, postsErr := h.service.GetGroupsPost(req, groupIdstr)
	if postsErr.Code != http.StatusOK {
		utils.ResponseJSON(w, postsErr.Code, postsErr)
		return
	}
	utils.ResponseJSON(w, postsErr.Code, posts)

}
