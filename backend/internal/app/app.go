package app

import (
	"database/sql"

	staticHandlers "github.com/ismailsayen/social-network/internal/handlers/static"

	handlers "github.com/ismailsayen/social-network/internal/handlers/auth"
	repositories "github.com/ismailsayen/social-network/internal/repositories/auth"
	services "github.com/ismailsayen/social-network/internal/services/auth"

	// ===================== relations =============================//
	relationsH "github.com/ismailsayen/social-network/internal/handlers/relations"
	relationsR "github.com/ismailsayen/social-network/internal/repositories/relations"
	relationsS "github.com/ismailsayen/social-network/internal/services/relations"

	// ===================== posts =================================//
	chatHandlers "github.com/ismailsayen/social-network/internal/handlers/chat"
	posthandlers "github.com/ismailsayen/social-network/internal/handlers/post"
	chatRepo "github.com/ismailsayen/social-network/internal/repositories/chat"
	postrepositories "github.com/ismailsayen/social-network/internal/repositories/post"
	chatServices "github.com/ismailsayen/social-network/internal/services/chat"
	postservices "github.com/ismailsayen/social-network/internal/services/post"

	// ===================== Profile ===============================//
	profileHandlers "github.com/ismailsayen/social-network/internal/handlers/profile"
	profileRepo "github.com/ismailsayen/social-network/internal/repositories/profile"
	profileServices "github.com/ismailsayen/social-network/internal/services/profile"

	// ===================== Group ===============================//
	groupHandlers "github.com/ismailsayen/social-network/internal/handlers/group"
	groupRepo "github.com/ismailsayen/social-network/internal/repositories/group"
	groupServices "github.com/ismailsayen/social-network/internal/services/group"
)

type Application struct {
	DB               *sql.DB
	AuthHundler      *handlers.UserHandler
	ChatHandler      *chatHandlers.ChatHandler
	PostHandler      *posthandlers.PostHandler
	ProfileHandler   *profileHandlers.ProfileHandler
	Relationshandler *relationsH.RelationsHandler
	StaticHandler    *staticHandlers.ImageHandler
	GroupHandler     *groupHandlers.GroupHandler
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
	//================= profile =================//
	ProfileRepo := profileRepo.NewProfileRepository(db)
	ProfileServices := profileServices.NewProfileService(ProfileRepo)
	ProfileHandler := profileHandlers.NewProfileHandler(ProfileServices)
	//================ relations ===============//
	RelationsRepo := relationsR.NewRelationsRepository(db)
	RelationsSer := relationsS.NewRelationsServices(RelationsRepo)
	Relationshand := relationsH.NewRelationsHandler(RelationsSer)
	//================ static =========================//
	staticHAndler := staticHandlers.NewImageHandler("pkg/db/images")

	// ===================== Group ===============================//
	GroupRepo := groupRepo.NewGroupRepo(db)
	GroupService := groupServices.NewGroupService(GroupRepo)
	GroupHandler := groupHandlers.NewGroupHandler(GroupService)

	return &Application{
		DB:               db,
		AuthHundler:      AuthHandler,
		ChatHandler:      ChatHandler,
		ProfileHandler:   ProfileHandler,
		PostHandler:      PostHandler,
		Relationshandler: Relationshand,
		StaticHandler:    staticHAndler,
		GroupHandler:     GroupHandler,
	}
}
