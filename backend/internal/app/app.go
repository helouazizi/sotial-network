package app

import (
	"database/sql"

	handlers "github.com/ismailsayen/social-network/internal/handlers/auth"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	services "github.com/ismailsayen/social-network/internal/services/auth"

	chatHandlers "github.com/ismailsayen/social-network/internal/handlers/chat"
	chatRepo "github.com/ismailsayen/social-network/internal/repositories/chat"
	chatServices "github.com/ismailsayen/social-network/internal/services/chat"
)

type Application struct {
	DB          *sql.DB
	AuthHundler *handlers.UserHandler
	ChatHandler *chatHandlers.ChatHandler
}

func NewApp(db *sql.DB) *Application {
	AuthRepo := repositories.NewAuthRepo(db)
	AuthService := services.NewAuthService(AuthRepo)
	AuthHandler := handlers.NewAuthHandler(AuthService)

	ChatRepo := chatRepo.NewChatRepo(db)
	ChatService := chatServices.NewChatService(ChatRepo)
	ChatHandler := chatHandlers.NewChatHandler(ChatService)

	return &Application{
		DB:          db,
		AuthHundler: AuthHandler,
		ChatHandler: ChatHandler,
	}
}
