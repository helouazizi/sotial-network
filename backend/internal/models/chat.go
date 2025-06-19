package models

type Chat struct {
	Message    string `json:"message"`
	SenderID   int    `json:"sender_id"`
	ReceiverID int    `json:"receiver_id"`
	Type       string `json:"type"`
}
