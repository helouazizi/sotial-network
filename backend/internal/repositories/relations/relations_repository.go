package relations

import "database/sql"

type RelationsRepository struct {
	db *sql.DB
}

func NewRelationsRepository(db *sql.DB) *RelationsRepository {
	return &RelationsRepository{db: db}
}
