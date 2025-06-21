package routers

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
	"github.com/ismailsayen/social-network/pkg/middleware"
)

func SetupRoutes(app *app.Application) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/user/register", app.AuthHundler.Register)
	mux.HandleFunc("/api/v1/user/login", app.AuthHundler.Login)

	// mux.HandleFunc("/api/v1/profile", app.ProfileHandler.ProfileHandler)
	// mux.HandleFunc("/api/v1/user/login", app.AuthHundler.Login)
	//================== Profile routes =======================///
	mux.HandleFunc("/api/v1/profile", middleware.AuthMiddleware(http.HandlerFunc(app.ProfileHandler.ProfileHandler), app.DB))

	//================== posts routes =========================///
	mux.HandleFunc("/api/v1/posts", app.PostHandler.GetPosts)
	mux.HandleFunc("/api/v1/posts/create", app.PostHandler.CreatePost)

	//================== chat routes =========================///
	mux.HandleFunc("/ws", app.ChatHandler.ChatMessagesHandler)

	fs := http.FileServer(http.Dir("pkg/db/images"))
	mux.Handle("/images/", http.StripPrefix("/images/", fs))

	return mux
}
