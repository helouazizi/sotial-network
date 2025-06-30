package models

import "time"

type Chat struct {
	ID         int       `json:"id"`
	Message    string    `json:"message"`
	SenderID   int       `json:"sender_id"`
	ReceiverID int       `json:"receiver_id"`
	Type       string    `json:"type"`
	SentAt     time.Time `json:"sent_at"`
	LastId     int       `json:"last_id"`
}
