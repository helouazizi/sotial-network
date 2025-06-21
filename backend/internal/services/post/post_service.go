package services

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/post"
)

type PostService struct {
	repo *repositories.PostRepository
}

func NewAuthService(postRepo *repositories.PostRepository) *PostService {
	return &PostService{repo: postRepo}
}

func (s *PostService) SavePost(post *models.Post, img *models.Image) error {
	if n := len(strings.Fields(post.Title)); n == 0 || n > 255 {
		return errors.New("title is required and must be less than 256 characters")
	}
	if n := len(strings.Fields(post.Content)); n == 0 || n > 500 {
		return errors.New("body is required and must be less than 500 characters")
	}

	allowedPrivacy := map[string]bool{
		"public":         true,
		"almost_private": true,
		"private":        true,
	}

	if !allowedPrivacy[post.Type] {
		return errors.New("unsuported privacy")
	}

	if img != nil && (img.ImgHeader != nil || img.ImgContent != nil) {
		if img.ImgHeader != nil && len(img.ImgHeader.Filename) < 3 {
			return errors.New("invalid image name")
		}

		if img.ImgContent != nil {
			file := img.ImgContent
			buf := make([]byte, 512)
			if _, err := file.Read(buf); err != nil {
				return fmt.Errorf("could not read file: %w", err)
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
				return errors.New("unsupported image type")
			}
		}
	}

	return s.repo.SavePost(post, img) // img may be nil
}

func (s *PostService) GetPosts(start, limit string) ([]models.Post, error) {
	strt, err := strconv.Atoi(start)
	if err != nil {
		return []models.Post{}, err
	}
	lmt, err1 := strconv.Atoi(limit)
	if err1 != nil {
		return []models.Post{}, err1
	}
	return s.repo.GetPosts(strt, lmt)
}
