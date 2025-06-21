package handlers

import (
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
		fmt.Println(err, "here")
		return
	}

	// Convert raw media bytes to base64 so it’s safe in JSON.
	// for i := range posts {
	// 	if len(posts[i].Media) > 0 {
	// 		posts[i].Media = []byte(base64.StdEncoding.EncodeToString(posts[i].Media))
	// 	}
	// }

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
