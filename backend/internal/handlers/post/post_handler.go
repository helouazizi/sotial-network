// backend/internal/handlers/post/post_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/post"
	"github.com/ismailsayen/social-network/pkg/utils"
)

const maxUpload = 10 << 20 // 10 MB
type PostHandler struct {
	service *services.PostService
}

func NewAuthHandler(postService *services.PostService) *PostHandler {
	return &PostHandler{service: postService}
}

func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
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
	userId := r.Context().Value("userID").(int)

	posts, err := h.service.GetPosts(userId, req.Offset, req.Limit)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Internal server error",
			"status":  http.StatusInternalServerError,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, posts)
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}

	userId := r.Context().Value("userID").(int)
	r.Body = http.MaxBytesReader(w, r.Body, maxUpload)
	err := r.ParseMultipartForm(maxUpload) // 10 MB
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad Request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	post := &models.Post{
		Author:  models.User{ID: userId},
		Title:   r.FormValue("title"),
		Content: r.FormValue("content"),
		Type:    r.FormValue("privacy"),
	}

	if post.Type == "private" {
		idStrs := r.Form["shared_with"]
		for _, s := range idStrs {
			if id, err := strconv.Atoi(s); err == nil {
				post.AllowedUsres = append(post.AllowedUsres, id)
			}
		}
	}

	// Try to read the file
	file, header, err := r.FormFile("image")
	var img *models.Image // nil unless file is provided
	if err == nil {
		img = &models.Image{
			ImgHeader:  header,
			ImgContent: file,
		}

		defer file.Close()
	}
	// Pass image as nil if not uploaded
	savedPost, err1 := h.service.SavePost(r.Context(), post, img)
	if err1 != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, savedPost)
}

func (h *PostHandler) HandlePostVote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}
	var vote models.VoteRequest
	if err := json.NewDecoder(r.Body).Decode(&vote); err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}
	userId := r.Context().Value("userID").(int)
	vote.UserId = userId
	err := h.service.PostVote(vote)
	if err != nil {
		http.Error(w, "Failed to vote", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *PostHandler) CreatePostComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxUpload)
	if err := r.ParseMultipartForm(maxUpload); err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "invalid multipart form",
			"status":  http.StatusBadRequest,
		})
		return
	}

	postIdStr := r.FormValue("post_id")
	postId, err := strconv.Atoi(postIdStr)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "invalid multipart form",
			"status":  http.StatusBadRequest,
		})
		return
	}

	coment := models.Comment{
		Comment:   r.FormValue("comment"),
		PostID:    postId,
		CreatedAt: time.Now().Format(time.RFC3339),
		Author:    models.User{ID: r.Context().Value("userID").(int)},
	}

	file, header, err := r.FormFile("image")
	var img *models.Image
	if err == nil {
		img = &models.Image{
			ImgHeader:  header,
			ImgContent: file,
		}

		defer file.Close()
	}

	comment,err := h.service.CreatePostComment(coment, img)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}
		utils.ResponseJSON(w, http.StatusOK, comment)
}

func (h *PostHandler) GetPostComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var coment models.ComentPaginationRequest
	if err := json.NewDecoder(r.Body).Decode(&coment); err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	commnets, err := h.service.GetPostComment(coment)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	utils.ResponseJSON(w, http.StatusOK, commnets)
}

func (h *PostHandler) GetFolowers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userId := r.Context().Value("userID").(int)

	folowers, err := h.service.GetFolowers(userId)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		return
	}
	utils.ResponseJSON(w, http.StatusOK, folowers)
}
