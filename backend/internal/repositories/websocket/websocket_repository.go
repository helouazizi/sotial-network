package repositories

import (
	"database/sql"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type WebsocketRepository struct {
	db *sql.DB
}

func NewWebsocketRepo(db *sql.DB) *WebsocketRepository {
	return &WebsocketRepository{db: db}
}

func (r *WebsocketRepository) SaveMessage(chat *models.Chat) (int, error) {
	query := `INSERT INTO chat_message (sender_id, receiver_id, content, sent_at) VALUES (?,?,?,?) RETURNING id`

	lastMessageID := 0
	err := r.db.QueryRow(query, chat.SenderID, chat.ReceiverID, chat.Message, time.Now()).Scan(&lastMessageID)
	return lastMessageID, err
}

func (r *WebsocketRepository) GetMessages(senderID, receiverID int, lastID int) ([]*models.Chat, error) {
	query := `
		SELECT * FROM chat_message
		WHERE ((sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?)) AND id < ?
		ORDER BY id DESC
		LIMIT 10
	`
	rows, err := r.db.Query(query, senderID, receiverID, senderID, receiverID, lastID)
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

		message.SentAtStr = message.SentAt.Format(time.DateTime)

		messages = append(messages, &message)
	}

	return messages, nil
}

func (r *WebsocketRepository) GetFriends(userID int) ([]*models.User, error) {
	query := `
		SELECT id, nickname ,first_name, last_name
		FROM users
		WHERE id != ?
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}

	var users []*models.User
	for rows.Next() {
		var user models.User
		err = rows.Scan(&user.ID, &user.Nickname, &user.FirstName, &user.Lastname)
		if err != nil {
			return nil, err
		}

		users = append(users, &user)
	}

	return users, nil
}

func (r *WebsocketRepository) GetLastMessageID() (int, error) {
	query := `
		SELECT id FROM chat_message
		ORDER BY id desc
		LIMIT 1
	`

	var id int
	err := r.db.QueryRow(query).Scan(&id)
	return id + 1, err
}

func (reqRepo *WebsocketRepository) CountNotiif(sessionID int) (int, int, error) {
	var groupeReqCount int
	var followersCount int
	query := `SELECT COUNT(id)
			FROM group_requests 
			WHERE requested_id=?;
	`
	err := reqRepo.db.QueryRow(query, sessionID).Scan(&groupeReqCount)
	if err != nil {
		return 0, 0, err
	}
	query = `SELECT COUNT(id)
			FROM followers 
			WHERE followed_id=? and status='pending';
	`
	err = reqRepo.db.QueryRow(query, sessionID).Scan(&followersCount)
	if err != nil {
		return 0, 0, err
	}
	return groupeReqCount, followersCount, nil
}

func (reqRepo *WebsocketRepository) RequestFollowers(sessionID int) ([]models.CommunInfoProfile, error) {
	query := `SELECT u.id,u.avatar,u.nickname,u.last_name,u.first_name,f.id
		FROM users u
		INNER JOIN followers f ON u.id=f.follower_id
		WHERE f.followed_id=? and f.status='pending';
	`
	rows, err := reqRepo.db.Query(query, sessionID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var followers []models.CommunInfoProfile
	for rows.Next() {
		var follower models.CommunInfoProfile
		rows.Scan(&follower.User.ID, &follower.User.Avatar, &follower.User.Nickname, &follower.User.Lastname, &follower.User.FirstName, &follower.IdRequest)
		followers = append(followers, follower)
	}
	return followers, nil
}

func (reqRepo *WebsocketRepository) HandleReqFollowRepo(reqID, followedID, followerID int, newStatus string) error {
	query := `UPDATE followers SET status=? WHERE id=? AND follower_id=? AND followed_id=?`
	_, err := reqRepo.db.Exec(query, newStatus, reqID, followerID, followedID)
	if err != nil {
		return err
	}
	return nil
}
