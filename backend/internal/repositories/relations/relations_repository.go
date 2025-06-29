package relations

import (
	"database/sql"
	"fmt"
)

type RelationsRepository struct {
	db *sql.DB
}

func NewRelationsRepository(db *sql.DB) *RelationsRepository {
	return &RelationsRepository{db: db}
}

func (rlrepo *RelationsRepository) UpdateRelation(newStatus string, profileID, sessionID int, haveAccess bool) error {
	fmt.Println(newStatus)
	query := `SELECT id FROM followers WHERE follower_id=? and followed_id=?`
	row, err := rlrepo.db.Exec(query, sessionID, profileID)
	if err != nil {
		return err
	}
	idRelation, err := row.LastInsertId()
	if err != nil {
		return err
	}
	if idRelation == 0 {
		query=`INSERT INTO followers (followed_id,follower_id,followed_at) VALUES(?,?,?)`
		
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
