// new file: internal/handlers/image.go
package handlers

import (
	"net/http"
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
	// Optional: put extra security / logging here
	// e.g. validate path, add Cache-Control, etc.

	// Strip the prefix so /images/foo.png maps to pkg/db/images/foo.png
	http.StripPrefix("/images/", h.fs).ServeHTTP(w, r)
}
