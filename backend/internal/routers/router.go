package routers

import "net/http"

func SetupRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/user/register", func(w http.ResponseWriter, r *http.Request) {})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello from social network"))
	})

	return mux
}
