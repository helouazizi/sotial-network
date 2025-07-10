package models

import "time"

type Group struct {
	ID          int       `json:"id"`
	UserID      int       `json:"user_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}
type GroupPost struct {
	GroupId int `json:"group_id"`
	Post Post 
}
