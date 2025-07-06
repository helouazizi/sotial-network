package requests

import "database/sql"

type RequestRepos struct {
	db *sql.DB
}

func NewRequestRepos(db *sql.DB) *RequestRepos {
	return &RequestRepos{db: db}
}
