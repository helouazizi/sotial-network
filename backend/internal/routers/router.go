package routers

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
	"github.com/ismailsayen/social-network/pkg/middleware"
)

func SetupRoutes(app *app.Application) *http.ServeMux {
	mux := http.NewServeMux()

	//================== user routes =======================///
	mux.HandleFunc("/api/v1/user/register", app.AuthHundler.Register)
	mux.HandleFunc("/api/v1/user/login", app.AuthHundler.Login)

	//================== Profile routes =======================///
	mux.HandleFunc("/api/v1/profile", middleware.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		app.ProfileHandler.ProfileHandler(w, r)
	}), app.DB))

	//================== posts routes =========================///
	mux.Handle("/api/v1/posts", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.GetPosts), app.DB))
	mux.Handle("/api/v1/posts/create", middleware.AuthMiddleware(http.HandlerFunc(app.PostHandler.CreatePost), app.DB))

	//================== chat routes =========================///
	mux.HandleFunc("/ws", app.ChatHandler.ChatMessagesHandler)

	fs := http.FileServer(http.Dir("pkg/db/images"))
	mux.Handle("/images/", http.StripPrefix("/images/", fs))

	return mux
}
