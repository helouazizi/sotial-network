// new file: internal/handlers/image.go
package handlers

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/ismailsayen/social-network/pkg/utils"
)

type ImageHandler struct {
	BaseDir string       // e.g. "pkg/db/images"
	fs      http.Handler // internal file server
}

func NewImageHandler(baseDir string) *ImageHandler {
	return &ImageHandler{
		BaseDir: baseDir,
		fs:      http.FileServer(http.Dir(baseDir)),
	}
}

func (h *ImageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	relPath := strings.TrimPrefix(r.URL.Path, "/images/")
	cleanPath := filepath.Clean(relPath)

	baseDir := "pkg/db/images" // correct relative path from working dir
	fullPath := filepath.Join(baseDir, cleanPath)

	fileInfo, err := os.Stat(fullPath)
	if err != nil || fileInfo.IsDir() {
		utils.ResponseJSON(w, http.StatusNotFound, map[string]any{
			"message": "Not Found",
			"status":  http.StatusNotFound,
		})
		return
	}

	http.StripPrefix("/images/", h.fs).ServeHTTP(w, r)
}
