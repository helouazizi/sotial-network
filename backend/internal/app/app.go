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
	chatHandlers "github.com/ismailsayen/social-network/internal/handlers/chat"
	chatRepo "github.com/ismailsayen/social-network/internal/repositories/chat"
	chatServices "github.com/ismailsayen/social-network/internal/services/chat"
)

type Application struct {
	DB          *sql.DB
	AuthHundler *handlers.UserHandler
	PostHandler *posthandlers.PostHandler
	ChatHandler *chatHandlers.ChatHandler
}

func NewApp(db *sql.DB) *Application {
	AuthRepo := repositories.NewAuthRepo(db)
	AuthService := services.NewAuthService(AuthRepo)
	AuthHandler := handlers.NewAuthHandler(AuthService)

	// ================= posts ==================//
	PostRepo := postrepositories.NewPostRepo(db)
	PostService := postservices.NewAuthService(PostRepo)
	PostHandler := posthandlers.NewAuthHandler(PostService)
	ChatRepo := chatRepo.NewChatRepo(db)
	ChatService := chatServices.NewChatService(ChatRepo)
	ChatHandler := chatHandlers.NewChatHandler(ChatService)

	return &Application{
		DB:          db,
		AuthHundler: AuthHandler,
		PostHandler: PostHandler,
		ChatHandler: ChatHandler,
	}
}
