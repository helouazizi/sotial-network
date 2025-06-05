package app

import (
	"database/sql"

	handlers "github.com/ismailsayen/social-network/internal/handlers/auth"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	services "github.com/ismailsayen/social-network/internal/services/auth"
)

type Application struct {
	DB          *sql.DB
	AuthHundler *handlers.UserHandler
}

func NewApp(db *sql.DB) *Application {
	// initialize repositories
	UserRepo := repositories.NewRepo(db)
	// initialize services
	userService := services.NewService(UserRepo)
	// initialize handlers
	userHandler := handlers.NewHandler(userService)

	return &Application{
		DB: db,
		AuthHundler: userHandler,
	}
}
