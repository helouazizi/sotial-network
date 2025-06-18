package token

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/ismailsayen/social-network/internal/models"
)

func GenerateToken() (string, error) {
	token, err := uuid.NewV7()
	if err != nil {
		return "", err
	}
	return token.String(), nil
}

func GetToken(r *http.Request, name string) (string, models.Error) {
	cookie, err := r.Cookie(name)
	if err != nil || cookie.Value == "" {
		// Return unauthorized if there's no cookie or cookie is empty
		return "", models.Error{
			Message: "Service Unauthorized",
			Code:    http.StatusUnauthorized,
		}
	}
	token := cookie.Value

	return token, models.Error{Message: "User Has Token", Code: http.StatusOK}
}
