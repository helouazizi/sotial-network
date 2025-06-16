package models

type Post struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	Title     string `json:"title"`
	Content   string `json:"body"`
	Media     []byte `json:"media,omitempty"`
	Likes     int    `json:"likes"`
	Dislikes  int    `json:"dislikes"`
	// Comments  int    `json:"comments"`
	Privacy   string `json:"privacy"`
	CreatedAt string `json:"created_at"`
}
