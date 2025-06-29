package relations

import (
	"database/sql"
	"time"
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
