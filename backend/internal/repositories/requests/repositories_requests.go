package requests

import "database/sql"

type RequestRepos struct {
	db *sql.DB
}

func NewRequestRepos(db *sql.DB) *RequestRepos {
	return &RequestRepos{db: db}
}

func (reqRepo *RequestRepos) GetNumsofRequests(sessionID int) (int, int, error) {
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
