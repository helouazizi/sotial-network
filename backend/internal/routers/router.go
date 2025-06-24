package routers

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
	"github.com/ismailsayen/social-network/pkg/middleware"
)

func SetupRoutes(app *app.Application) *http.ServeMux {
	mux := http.NewServeMux()

	//================== user routes =======================///
	mux.HandleFunc("/app/v1/user/logout",app.AuthHundler.LogOut)
	mux.HandleFunc("/api/v1/user/register", app.AuthHundler.Register)
	mux.HandleFunc("/api/v1/user/login", app.AuthHundler.Login)
	mux.HandleFunc("/app/v1/user/Auth" , middleware.AuthMiddleware(http.HandlerFunc(app.AuthHundler.CheckAuth), app.DB))


	//================== Profile routes =======================///
	mux.HandleFunc("/api/v1/profile", middleware.AuthMiddleware(http.HandlerFunc(app.ProfileHandler.ProfileHandler), app.DB))

	//================== posts routes =========================///
	mux.Handle("/api/v1/posts", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.GetPosts), app.DB))
	mux.Handle("/api/v1/posts/create", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.CreatePost), app.DB))
	mux.Handle("/api/v1/posts/vote", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.HandlePostVote), app.DB))

	//================== chat routes =========================///
	mux.HandleFunc("/ws", middleware.AuthMiddleware(http.HandlerFunc(app.ChatHandler.ChatMessagesHandler), app.DB))

	fs := http.FileServer(http.Dir("pkg/db/images"))
	mux.Handle("/images/", http.StripPrefix("/images/", fs))

	return mux
}
