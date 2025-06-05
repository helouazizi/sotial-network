package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ismailsayen/social-network/internal/routers"
	"github.com/ismailsayen/social-network/pkg/db/sqlite"
)

func main() {
	db := sqlite.OpenDB()
	defer db.Close()

	fmt.Println("Successfully created database")

	mux := routers.SetupRoutes()

	fmt.Println("Server run: http://localhost:8080/")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
