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

type GroupComment struct {
	GroupId int `json:"group_id"`
	Comment Comment
}
type Event struct {
	ID          int       `json:"id"`
	GroupId     int       `json:"group_id"`
	UserID      int       `json:"user_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	EventDate   time.Time `json:"event_date"`
	CreatedAt   time.Time `json:"created_at"`
}

type EventVote struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Vote   string `json:"vote"` // going or not going
}
