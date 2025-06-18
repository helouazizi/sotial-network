package app

import (
	"database/sql"

	handlers "github.com/ismailsayen/social-network/internal/handlers/auth"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	services "github.com/ismailsayen/social-network/internal/services/auth"

	// ===================== posts =================================//
	chatHandlers "github.com/ismailsayen/social-network/internal/handlers/chat"
	posthandlers "github.com/ismailsayen/social-network/internal/handlers/post"
	chatRepo "github.com/ismailsayen/social-network/internal/repositories/chat"
	postrepositories "github.com/ismailsayen/social-network/internal/repositories/post"
	chatServices "github.com/ismailsayen/social-network/internal/services/chat"
	postservices "github.com/ismailsayen/social-network/internal/services/post"

	profileHandlers "github.com/ismailsayen/social-network/internal/handlers/profile"
	profileRepo "github.com/ismailsayen/social-network/internal/repositories/profile"
	profileServices "github.com/ismailsayen/social-network/internal/services/profile"
)

type Application struct {
	DB             *sql.DB
	AuthHundler    *handlers.UserHandler
	ChatHandler    *chatHandlers.ChatHandler
	PostHandler    *posthandlers.PostHandler
	ProfileHandler *profileHandlers.ProfileHandler
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

	ProfileRepo := profileRepo.NewProfileRepository(db)
	ProfileServices := profileServices.NewProfileService(ProfileRepo)
	ProfileHandler := profileHandlers.NewProfileHandler(ProfileServices)
	return &Application{
		DB:             db,
		AuthHundler:    AuthHandler,
		ChatHandler:    ChatHandler,
		ProfileHandler: ProfileHandler,
		PostHandler:    PostHandler,
	}
}
