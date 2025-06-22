package models

import "mime/multipart"

type Post struct {
	UserId        int
	ID            int      `json:"id"`
	Title         string   `json:"title"`
	Content       string   `json:"content"`
	Media         []byte   `json:"media,omitempty"`
	MediaLink     string   `json:"media_link,omitempty"`
	Likes         int      `json:"likes"`
	Dislikes      int      `json:"dislikes"`
	TotalComments int      `json:"total_comments"`
	UserVote      *string  `json:"user_vote"`
	Comments      []string `json:"comments"`
	Type          string   `json:"privacy"`
	CreatedAt     string   `json:"created_at"`
}

type Image struct {
	ImgHeader  *multipart.FileHeader
	ImgContent multipart.File
}

type PaginationRequest struct {
	Offset int `json:"offset"` // 0‑based index
	Limit  int `json:"limit"`  // page size
}

type VoteRequest struct {
	PostID int    `json:"post_id"`
	Action string `json:"action"` // "like" | "dislike" | "unlike" | "undislike"
	UserId int
}


type Comment struct {
    ID        int    `json:"id"`
    PostID    int    `json:"post_id"`
    AuthorID  int    `json:"author"` // or `UserID`
    Comment   string `json:"comment"`
    CreatedAt string `json:"created_at"`
}
