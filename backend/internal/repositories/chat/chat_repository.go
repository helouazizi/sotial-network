package repositories

import (
	"database/sql"
	"fmt"

	"github.com/ismailsayen/social-network/internal/models"
)

type ChatRepository interface {
	Save(hat *models.Chat) error
}

type ChatRepositoryImpl struct {
	db *sql.DB
}

func NewChatRepo(db *sql.DB) ChatRepository {
	return &ChatRepositoryImpl{db: db}
}

func (r *ChatRepositoryImpl) Save(chat *models.Chat) error {
	fmt.Println(chat)
	return nil
}
