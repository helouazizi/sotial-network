package repositories

import (
	"database/sql"
	"time"

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
	query := `INSERT INTO chat_message (sender_id, receiver_id, content, sent_at) VALUES (?,?,?,?)`
	_, err := r.db.Exec(query, chat.SenderID, chat.ReceiverID, chat.Message, time.Now())
	return err
}
