package services

import (
	"errors"
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

func (s *PostService) SavePost(post *models.Post) error {
	if len(strings.Fields(post.Title)) == 0 || len(strings.Fields(post.Title)) > 255 {
		return errors.New("title is required and must be less than 256 characters")
	}
	if len(strings.Fields(post.Content)) == 0 || len(strings.Fields(post.Content)) > 500 {
		return errors.New("body is required and must be less than 500 characters")
	}

	validPrivacy := map[string]bool{
		"public":         true,
		"almost_private": true,
		"private":        true,
	}
	if !validPrivacy[post.Type] {
		return errors.New("invalid privacy value")
	}

	// If you want, you can add logic to handle media or other fields here

	// If validation passes, save using the repo
	return s.repo.SavePost(post)
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
	return s.repo.GetPosts(strt,lmt)
}
