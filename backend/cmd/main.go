package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ismailsayen/social-network/internal/app"
	"github.com/ismailsayen/social-network/internal/routers"
	"github.com/ismailsayen/social-network/pkg/db/sqlite"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db := sqlite.OpenDB()
	defer db.Close()

	application := app.NewApp(db)

	fmt.Println("Successfully created database")

	mux := routers.SetupRoutes(application)

	fmt.Println("Server run: http://localhost:8080/")
	if err := http.ListenAndServe(":8080", CorsMiddleware(mux)); err != nil {
		log.Fatal(err)
	}
}


func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // or specify 127.0.0.1:5501
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			// Important: return immediately for preflight!
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
