package repositories

import (
	"database/sql"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type ChatRepository struct {
	db *sql.DB
}

func NewChatRepo(db *sql.DB) *ChatRepository {
	return &ChatRepository{db: db}
}

func (r *ChatRepository) SaveMessage(chat *models.Chat) error {
	query := `INSERT INTO chat_message (sender_id, receiver_id, content, sent_at) VALUES (?,?,?,?)`
	_, err := r.db.Exec(query, chat.SenderID, chat.ReceiverID, chat.Message, time.Now())
	return err
}

func (r *ChatRepository) GetMessages(senderID, receiverID int) ([]*models.Chat, error) {
	query := `
		SELECT * FROM chat_message
		WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?)
	`
	rows, err := r.db.Query(query, senderID, receiverID, senderID, receiverID)
	if err != nil {
		return nil, err
	}

	var messages []*models.Chat
	for rows.Next() {
		var message models.Chat
		err = rows.Scan(&message.ID, &message.SenderID, &message.ReceiverID, &message.Message, &message.SentAt)
		if err != nil {
			return nil, err
		}

		messages = append(messages, &message)
	}

	return messages, nil
}

func (r *ChatRepository) GetUser(userID int) (*models.User, error) {
	query := `
		SELECT id, nickname ,first_name, last_name
		FROM users
		WHERE id = ?
	`

	var user models.User
	err := r.db.QueryRow(query, userID).Scan(&user.ID, &user.Nickname, &user.FirstName, &user.Lastname)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
