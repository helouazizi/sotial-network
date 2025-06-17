package repositories

import "database/sql"

type ChatRepository struct {
	db *sql.DB
}
