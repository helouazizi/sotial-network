package routers

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
	"github.com/ismailsayen/social-network/pkg/middleware"
)

func SetupRoutes(app *app.Application) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/user/register", app.AuthHundler.Register)
	mux.HandleFunc("/api/v1/user/login",app.AuthHundler.Login)

	mux.HandleFunc("/api/v1/profile", app.ProfileHandler.ProfileHandler)


	//================== posts routes =========================///
	mux.HandleFunc("/api/v1/posts", app.PostHandler.GetPosts)
	mux.HandleFunc("/api/v1/posts/create", app.PostHandler.CreatePost)




	//================== chat routes =========================///
	mux.HandleFunc("/ws", app.ChatHandler.ChatMessagesHandler)

	mux.HandleFunc("/", middleware.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello from social network"))
	}), app.DB) )
	

	return mux
}
