package models

import "time"

type Group struct {
	ID            int       `json:"id,omitempty"`
	UserID        int       `json:"user_id,omitempty"`
	Title         string    `json:"title,omitempty"`
	Description   string    `json:"description,omitempty"`
	CreatedAt     time.Time `json:"created_at,omitempty"`
	Count_Members int       `json:"count_members,omitempty"`
	Members       []string  `json:"members,omitempty"`
	RequestID     int       `json:"request_id,omitempty"`
}
type GroupPost struct {
	GroupId int `json:"group_id"`
	Post    Post
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

type GroupIfo struct {
	Group        Group `json:"group"`
	Author       User  `json:"author"`
	TotalMembers int   `json:"total_members"`
}

type GroupMembers struct {
	Members []User `json:"members"`
}

type GroupRequest struct {
	ID          int    `json:"id,omitempty"`
	GroupID     int    `json:"group_id,omitempty"`
	SenderID    int    `json:"sender_id,omitempty"`
	RequestedID []int  `json:"requested_id,omitempty"`
	Type        string `json:"type,omitempty"`
	UserInfos   *User  `json:"user"`
	GroupInfos  *Group `json:"group"`
}
type GroupMessages struct {
	ID       int    `json:"id,omitempty"`
	GroupID  int    `json:"group_id,omitempty"`
	SenderID int    `json:"sender_id,omitempty"`
	Message  string `json:"message,omitempty"`
	Avatar   string `json:"avatar,omitempty"`
	FullName string `json:"fullName,omitempty"`
	SentAt   string `json:"sent_at,omitempty"`
}
