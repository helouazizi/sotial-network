package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	services "github.com/ismailsayen/social-network/internal/services/post"
	"github.com/ismailsayen/social-network/pkg/utils"
)

type PostHandler struct {
	service *services.PostService
}

func NewAuthHandler(postService *services.PostService) *PostHandler {
	return &PostHandler{service: postService}
}

// handler/post_handler.go
func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	// Only allow POST now
	if r.Method != http.MethodPost {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}

	defer r.Body.Close()

	// Decode JSON body
	var req models.PaginationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid JSON payload",
			"status":  http.StatusBadRequest,
		})
		return
	}

	// Fetch posts
	posts, err := h.service.GetPosts(req.Offset, req.Limit)
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
	err := r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad Request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	title := r.FormValue("title")
	content := r.FormValue("content")
	privacy := r.FormValue("privacy")

	post := &models.Post{
		Title:   title,
		Content: content,
		Type:    privacy,
		UserId:  userId,
	}

	// Try to read the file
	file, header, err := r.FormFile("media")
	var img *models.Image // nil unless file is provided

	if err == nil {
		img = &models.Image{
			ImgHeader:  header,
			ImgContent: file,
		}

		defer file.Close()
	}

	// Pass image as nil if not uploaded
	err = h.service.SavePost(post, img)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		fmt.Println(err, "errt")
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Successfully created post",
		"status":  http.StatusOK,
	})
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
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Update the vote in your database here
	err := h.service.PostVote(vote)
	if err != nil {
		http.Error(w, "Failed to vote", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
