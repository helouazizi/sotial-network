package relations

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/ismailsayen/social-network/internal/models"
)

type RelationsRepository struct {
	db *sql.DB
}

func NewRelationsRepository(db *sql.DB) *RelationsRepository {
	return &RelationsRepository{db: db}
}

func (rlrepo *RelationsRepository) UpdateRelation(newStatus string, profileID, sessionID int, haveAccess bool) error {
	query := `SELECT id FROM followers WHERE follower_id=? AND followed_id=?`
	var idRelation int
	err := rlrepo.db.QueryRow(query, sessionID, profileID).Scan(&idRelation)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if err == sql.ErrNoRows {
		query = `INSERT INTO followers (followed_id, follower_id, status, followed_at) VALUES (?, ?, ?, ?)`
		_, err = rlrepo.db.Exec(query, profileID, sessionID, newStatus, time.Now().Format("2006-01-02 15:04:05"))
		if err != nil {
			return err
		}
		return nil
	}

	query = `UPDATE followers SET status=? WHERE id=?`
	_, err = rlrepo.db.Exec(query, newStatus, idRelation)
	if err != nil {
		return err
	}

	return nil
}

func (rlrepo *RelationsRepository) GetActuelStatus(profileID int) (int, error) {
	var Visibility int
	query := `SELECT is_private FROM users WHERE id=?`
	err := rlrepo.db.QueryRow(query, profileID).Scan(&Visibility)
	if err != nil {
		return 0, err
	}

	return Visibility, nil
}

func (rlrepo *RelationsRepository) GetUserRelations(info *models.GetUsers, columun, userColumun string) ([]models.CommunInfoProfile, error) {
	// id user,avatar user,fullName, nickname
	query := fmt.Sprintf(`SELECT u.id, u.avatar, u.last_name, u.first_name, u.nickname FROM users u INNER JOIN followers f on u.id=%s WHERE %s=$1 AND f.status='accepted' ORDER BY u.first_name LIMIT $2 OFFSET $3;`, userColumun, columun)
	rows, err := rlrepo.db.Query(query, info.ProfileID, info.Limit, info.Ofsset)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	var users []models.CommunInfoProfile
	for rows.Next() {
		var user models.CommunInfoProfile
		err = rows.Scan(&user.User.ID, &user.User.Avatar, &user.User.Lastname, &user.User.FirstName, &user.User.Nickname)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (rlrepo *RelationsRepository) GetFriendsRepo(sessionID int) ([]models.CommunInfoProfile, error) {
	query := `
	SELECt u.id, u.avatar, u.last_name, u.first_name, u.nickname 
	FROM users u 
	INNER JOIN followers f ON f.follower_id=u.id  
	WHERE f.followed_id=?;
	`
	rows, err := rlrepo.db.Query(query, sessionID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()
	var Friends []models.CommunInfoProfile
	for rows.Next() {
		var user models.CommunInfoProfile
		rows.Scan(&user.User.ID, &user.User.Avatar, &user.User.Lastname, &user.User.FirstName, &user.User.Nickname)
		Friends = append(Friends, user)
	}
	return Friends, nil
}

func (rlrepo *RelationsRepository) GetUnrequestedFriendsRepo(sessionID, grpID int) ([]models.CommunInfoProfile, error) {
	query := `
		SELECT 
			u.id, u.avatar, u.last_name, u.first_name, u.nickname 
		FROM 
			users u 
		INNER JOIN 
			followers f ON f.follower_id = u.id 
		WHERE 
			f.followed_id = ?
			AND u.id NOT IN (
				SELECT requested_id 
				FROM group_requests 
				WHERE sender_id = ? AND group_id = ?
			)
			AND u.id NOT IN (
				SELECT member_id
				FROM group_members
				WHERE group_id = ?
			);
	`

	rows, err := rlrepo.db.Query(query, sessionID, sessionID, grpID, grpID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var friends []models.CommunInfoProfile
	for rows.Next() {
		var user models.CommunInfoProfile
		if err := rows.Scan(&user.User.ID, &user.User.Avatar, &user.User.Lastname, &user.User.FirstName, &user.User.Nickname); err != nil {
			return nil, err
		}
		friends = append(friends, user)
	}
	return friends, nil
}
