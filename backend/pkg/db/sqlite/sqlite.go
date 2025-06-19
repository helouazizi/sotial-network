package sqlite

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func OpenDB() *sql.DB {
	RunMigration()
	db, err := sql.Open("sqlite3", "pkg/db/sqlite/social.db")
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	// _, err = db.Exec("PRAGMA foreign_keys = ON")
	// if err != nil {
	// 	log.Fatal("Failed to enable foreign keys:", err)
	// }

	return db
}

func RunMigration() {
	m, err := migrate.New("file://pkg/db/migrations", "sqlite3://pkg/db/sqlite/social.db")
	if err != nil {
		log.Fatal("failed to create DB driver:", err)
	}
	if err = m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}
}
