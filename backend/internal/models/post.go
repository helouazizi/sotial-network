package models

import "mime/multipart"

type Post struct {
	UserId        int
	ID            int     `json:"id"`
	Title         string  `json:"title"`
	Content       string  `json:"content"`
	MediaLink     string  `json:"media_link,omitempty"`
	Likes         int     `json:"likes"`
	Dislikes      int     `json:"dislikes"`
	TotalComments int     `json:"total_comments"`
	UserVote      *string `json:"user_vote"`
	Type          string  `json:"privacy"`
	CreatedAt     string  `json:"created_at"`
}

type Image struct {
	ImgHeader  *multipart.FileHeader
	ImgContent multipart.File
}

type PaginationRequest struct {
	Offset int `json:"offset"` // 0‑based index
	Limit  int `json:"limit"`  // page size
}

type ComentPaginationRequest struct {
	PostId int `json:"post_id"`
	Offset int `json:"offset"` // 0‑based index
	Limit  int `json:"limit"`  // page size
}

type VoteRequest struct {
	PostID int    `json:"post_id"`
	Action string `json:"action"` // "like" | "dislike" | "unlike" | "undislike"
	UserId int
}

type Comment struct {
	ID        int `json:"id"`
	PostID    int `json:"post_id"`
	AuthorID  int
	Comment   string   `json:"comment"`
	CreatedAt string   `json:"created_at"`
	MediaLink string   `json:"media_link,omitempty"`
	Author    PostUser `json:"author"` // or `UserID`
}

type PostUser struct {
	UserName  string `json:"user_name"`
	LastName  string `json:"first_name"`
	FirstName string `json:"last_name"`
	Avatar    string `json:"avatar"`
}

type PostFolower struct {
	User PostUser `json:"author"`
	Id   int      `json:"id"`
}
