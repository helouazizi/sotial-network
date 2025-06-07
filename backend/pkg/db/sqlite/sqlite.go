package sqlite

import (
	"database/sql"
	"io"
	"log"
	"os"

	_ "modernc.org/sqlite"
)

func OpenDB() *sql.DB {
	db, err := sql.Open("sqlite", "pkg/db/sqlite/social.db")
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	migrate, err := os.Open("pkg/db/migrations/migrate.sql")
	if err != nil {
		log.Fatal(err)
	}

	data, err := io.ReadAll(migrate)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(string(data))
	if err != nil {
		log.Fatal(err)
	}

	return db
}
