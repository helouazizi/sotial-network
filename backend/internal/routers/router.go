package routers

import (
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
)

func SetupRoutes(app *app.Application) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/user/register", app.AuthHundler.Register)


	//================== posts routes =========================///
	mux.HandleFunc("/api/v1/posts", app.PostHandler.GetPosts)
	mux.HandleFunc("/api/v1/posts/create", app.PostHandler.CreatePost)




	//================== chat routes =========================///
	mux.HandleFunc("/ws", app.ChatHandler.ChatMessagesHandler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello from social network"))
	})

	return mux
}
