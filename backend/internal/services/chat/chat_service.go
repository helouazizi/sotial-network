package services

import (
	repositories "github.com/ismailsayen/social-network/internal/repositories/chat"
)

type ChatService struct {
	repo *repositories.ChatRepository
}

func NewChatService(ChatRepo *repositories.ChatRepository) *ChatService {
	return &ChatService{repo: ChatRepo}
}