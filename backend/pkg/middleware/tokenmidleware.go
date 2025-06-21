package middleware

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/ismailsayen/social-network/internal/models"
	"github.com/ismailsayen/social-network/pkg/token"
	"github.com/ismailsayen/social-network/pkg/utils"
)


const userIDKey string = "userID"

func AuthMiddleware(next http.Handler, db *sql.DB) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := token.GetToken(r, "Token")
		if err.Code != http.StatusOK {
			utils.ResponseJSON(w, err.Code, err)
			return
		}
		const query = `
			SELECT id
			FROM users 
			WHERE token = ?
		`

		var id int

		errQuery := db.QueryRow(query, token).Scan(&id)
		if errQuery == sql.ErrNoRows {
			utils.ResponseJSON(w, http.StatusUnauthorized, models.Error{
				Message: "Invalid or expired token",
				Code:    http.StatusUnauthorized,
			})
			return
		}

		if errQuery != nil {
			utils.ResponseJSON(w, http.StatusInternalServerError, models.Error{
				Message: "Internal Server Error 20",
				Code:    http.StatusInternalServerError,
			})
			return
		}
		// Add user ID to context
		ctx := context.WithValue(r.Context(), userIDKey, id)

		// Proceed to next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
