package routers

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
	"github.com/ismailsayen/social-network/pkg/middleware"
)

func SetupRoutes(app *app.Application) *http.ServeMux {
	mux := http.NewServeMux()

	//================== user routes =======================///
	mux.HandleFunc("/api/v1/user/logout", app.AuthHundler.LogOut)
	mux.HandleFunc("/api/v1/user/register", app.AuthHundler.Register)
	mux.HandleFunc("/api/v1/user/login", app.AuthHundler.Login)
	mux.HandleFunc("/api/v1/user/Auth", middleware.AuthMiddleware(http.HandlerFunc(app.AuthHundler.CheckAuth), app.DB))
	mux.HandleFunc("/api/v1/user/infos", middleware.AuthMiddleware(http.HandlerFunc(app.AuthHundler.GetUserHandler), app.DB))

	//================== Profile routes =======================///
	mux.HandleFunc("/api/v1/profile", middleware.AuthMiddleware(http.HandlerFunc(app.ProfileHandler.ProfileHandler), app.DB))
	mux.HandleFunc("/api/v1/ChangeVisibilityProfile", middleware.AuthMiddleware(http.HandlerFunc(app.ProfileHandler.ChangeVisbility), app.DB))
	mux.HandleFunc("/api/v1/UpdateProfile", middleware.AuthMiddleware(http.HandlerFunc(app.ProfileHandler.UpdateProfile), app.DB))
	//================== posts routes =========================///
	mux.Handle("/api/v1/posts", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.GetPosts), app.DB))
	mux.Handle("/api/v1/posts/create", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.CreatePost), app.DB))
	mux.Handle("/api/v1/posts/vote", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.HandlePostVote), app.DB))
	mux.Handle("/api/v1/posts/addComment", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.CreatePostComment), app.DB))
	mux.Handle("/api/v1/posts/folowers", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.GetFolowers), app.DB))
	mux.HandleFunc("/api/v1/posts/getComments", (app.PostHandler.GetPostComment))
	//================= relations route ======================///
	mux.HandleFunc("/api/v1/relations/realtions", middleware.AuthMiddleware(http.HandlerFunc(app.Relationshandler.RelationHandler), app.DB))
	mux.HandleFunc("/api/v1/relations/getRealtions", middleware.AuthMiddleware(http.HandlerFunc(app.Relationshandler.GetRelations), app.DB))
	mux.HandleFunc("/api/v1/relations/getFriends", middleware.AuthMiddleware(http.HandlerFunc(app.Relationshandler.GetFriends), app.DB))
	//================== chat routes =========================///
	mux.HandleFunc("/ws", middleware.AuthMiddleware(http.HandlerFunc(app.WebsocketHandler.WebsocketHandler), app.DB))
	//================ static ==============================//
	mux.Handle("/images/", app.StaticHandler)

	//================ Group ==============================//
	mux.HandleFunc("/api/v1/groups/create", middleware.AuthMiddleware(http.HandlerFunc(app.GroupHandler.CreateGroupHandler), app.DB))
	mux.HandleFunc("/api/v1/groups/getJoined", middleware.AuthMiddleware(http.HandlerFunc(app.GroupHandler.GetJoinedGroupsHandler), app.DB))
	mux.HandleFunc("/api/v1/groups/getSuggested", middleware.AuthMiddleware(http.HandlerFunc(app.GroupHandler.GetSuggestedGroupsHandler), app.DB))

	return mux
}
