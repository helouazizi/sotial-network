package utils

import (
	"database/sql"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

func HandleImage(img *models.Image, dir string) (sql.NullString, models.Error) {
	var fileName sql.NullString // will be NULL if no image

	if img != nil && img.ImgContent != nil && img.ImgHeader != nil {
		// Reset file read pointer
		if seeker, ok := (img.ImgContent).(io.Seeker); ok {
			_, _ = seeker.Seek(0, io.SeekStart)
		}

		// Ensure directory exists

		if err := os.MkdirAll(dir, 0o755); err != nil {
			return fileName, models.Error{
				Code:    http.StatusInternalServerError,
				Message: "unable to create or access the specified directory",
			}
		}

		// Sanitize and generate unique filename
		origName := filepath.Base(time.Now().Format(time.DateTime) + "_" + img.ImgHeader.Filename)

		path := filepath.Join(dir, origName)

		dst, err := os.Create(path)
		if err != nil {
			return fileName, models.Error{
				Code:    http.StatusInternalServerError,
				Message: "unable to create the specified file",
			}
		}

		_, err = io.Copy(dst, img.ImgContent)
		dst.Close() // close file after copy
		if err != nil {
			return fileName, models.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to write content to the file",
			}
		}

		fileName = sql.NullString{String: origName, Valid: true}
	}
	return fileName, models.Error{
		Code:    http.StatusOK,
		Message: "operation completed successfully",
	}
}

func CheckImage(img *models.Image) models.Error {
	if img != nil && (img.ImgHeader != nil || img.ImgContent != nil) {
		if img.ImgHeader != nil && len(img.ImgHeader.Filename) < 3 {
			return models.Error{
				Code:    http.StatusBadRequest,
				Message: "invalid filename",
			}
		}

		if img.ImgContent != nil {
			file := img.ImgContent
			buf := make([]byte, 512)
			if _, err := file.Read(buf); err != nil {
				return models.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed to read image content",
				}
			}
			if seeker, ok := file.(io.Seeker); ok {
				_, _ = seeker.Seek(0, io.SeekStart)
			}

			allowed := map[string]bool{
				"image/jpeg": true,
				"image/png":  true,
				"image/gif":  true,
				"image/webp": true,
			}
			if ct := http.DetectContentType(buf); !allowed[ct] {
				return models.Error{
					Code:    http.StatusBadRequest,
					Message: "invalid image type",
				}
			}
		}
	}

	return models.Error{
		Code:    http.StatusOK,
		Message: "operation completed successfully",
	}
}
