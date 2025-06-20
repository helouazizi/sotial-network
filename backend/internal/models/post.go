package models

import "mime/multipart"

type Post struct {
	ID            int      `json:"id"`
	Title         string   `json:"title"`
	Content       string   `json:"content"`
	Media         []byte   `json:"media,omitempty"`
	MediaLink     string   `json:"media_link,omitempty"`
	Likes         int      `json:"likes"`
	Dislikes      int      `json:"dislikes"`
	TotalComments int      `json:"total_comments"`
	Comments      []string `json:"comments"`
	Type          string   `json:"privacy"`
	CreatedAt     string   `json:"created_at"`
}

type Image struct {
	ImgHeader  *multipart.FileHeader
	ImgContent *multipart.File
}
