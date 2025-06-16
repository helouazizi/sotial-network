package handlers

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

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
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}

	// === Get text fields ===
	title := r.FormValue("title")
	content := r.FormValue("content")
	privacy := r.FormValue("privacy")
	userIDStr := r.FormValue("user_id")

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// === Get the media file ===
	file, _, err := r.FormFile("media")
	var mediaData []byte
	if err == nil {
		defer file.Close()
		mediaData, err = io.ReadAll(file)
		if err != nil {
			http.Error(w, "Error reading media file", http.StatusInternalServerError)
			return
		}
	} // If no media is provided, mediaData remains nil

	// Debugging (optional)
	fmt.Println("Title:", title)
	fmt.Println("Content:", content)
	fmt.Println("Privacy:", privacy)
	fmt.Println("User ID:", userID)
	// fmt.Println("Media size (bytes):", len(mediaData), (mediaData))
	post := &models.Post{
		UserID:  userID,
		Title:   title,
		Content: content,
		Media:   mediaData,
		Type:    privacy,
	}
	err = h.service.SavePost(post)
	if err != nil {
		utils.ResponseJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Bad request",
			"status":  http.StatusBadRequest,
		})
		fmt.Println(err)
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]any{
		"message": "Successfully created post",
		"status":  http.StatusOK,
	})
}
