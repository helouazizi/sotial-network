package app

import (
	"database/sql"

	handlers "github.com/ismailsayen/social-network/internal/handlers/auth"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	services "github.com/ismailsayen/social-network/internal/services/auth"

	// ===================== posts =================================//
	posthandlers "github.com/ismailsayen/social-network/internal/handlers/post"
	postrepositories "github.com/ismailsayen/social-network/internal/repositories/post"
	postservices "github.com/ismailsayen/social-network/internal/services/post"
)

type Application struct {
	DB          *sql.DB
	AuthHundler *handlers.UserHandler
	PostHandler *posthandlers.PostHandler
}

func NewApp(db *sql.DB) *Application {
	AuthRepo := repositories.NewAuthRepo(db)
	AuthService := services.NewAuthService(AuthRepo)
	AuthHandler := handlers.NewAuthHandler(AuthService)

	// ================= posts ==================//
	PostRepo := postrepositories.NewPostRepo(db)
	PostService := postservices.NewAuthService(PostRepo)
	PostHandler := posthandlers.NewAuthHandler(PostService)

	return &Application{
		DB:          db,
		AuthHundler: AuthHandler,
		PostHandler: PostHandler,
	}
}
