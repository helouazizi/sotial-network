package handlers

import (
	"encoding/base64"
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

// get all posts
func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
		return
	}

	// lextrac the params from the auery
	start := r.URL.Query().Get("start")
	limit := r.URL.Query().Get("limit")
	posts, err := h.service.GetPosts(start, limit)
	if err != nil {
		utils.ResponseJSON(w, http.StatusInternalServerError, map[string]any{
			"message": "Internal Server Error",
			"status":  http.StatusInternalServerError,
		})
		return
	}

	// Convert raw media bytes to base64 so it’s safe in JSON.
	for i := range posts {
		if len(posts[i].Media) > 0 {
			posts[i].Media = []byte(base64.StdEncoding.EncodeToString(posts[i].Media))
		}
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

	// Parse the multipart form (maxMemory for in-memory part before writing to temp file)
	err := r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad Request",
			"status":  http.StatusBadRequest,
		})
		return
	}

	// === Get text fields ===
	title := r.FormValue("title")
	content := r.FormValue("content")
	privacy := r.FormValue("privacy")

	// === Get the media file ===
	file, header, _ := r.FormFile("media")

	post := &models.Post{
		Title:   title,
		Content: content,
		Type:    privacy,
	}
	Img := &models.Image{
		ImgHeader:  header,
		ImgContent: &file,
	}
	err = h.service.SavePost(post, Img)
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
