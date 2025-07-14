package models

import "time"

type WS struct {
	ID         int       `json:"id"`
	Message    string    `json:"message"`
	SenderID   int       `json:"sender_id"`
	ReceiverID int       `json:"receiver_id"`
	Type       string    `json:"type"`
	SentAt     time.Time `json:"sent_at"`
	SentAtStr  string    `json:"sent_at_str"`
	LastId     int       `json:"last_id"`
	Action     string    `json:"action"`
	GroupID    int       `json:"group_id"`
	Members    []int     `json:"members"`
}
