package models

import "time"

type Group struct {
	ID          int       `json:"id"`
	UserID      int       `json:"user_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Members     int       `json:"count_members,omitempty"`
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
	ID            int       `json:"id"`
	GroupId       int       `json:"group_id,omitempty"`
	UserID        int       `json:"user_id,omitempty"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	EventDate     time.Time `json:"event_date"`
	CreatedAt     time.Time `json:"created_at"`
	UserVote      string    `json:"vote"`
	TotalGoing    int       `json:"total_going"`
	TotalNotGoing int       `json:"total_not_going"`
	Author        User      `json:"author"`
}

type EventVote struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Vote   string `json:"vote"` // going or not going
}
