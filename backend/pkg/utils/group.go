package utils

import (
	"fmt"
	"net/http"
	"strings"
)

func GetGroupId(r *http.Request, endpoint string) (string, error) {
	path := r.URL.Path
	parts := strings.Split(path, "/")

	if len(parts) < 5 || parts[1] != "api" || parts[2] != "v1" || parts[3] != "groups" || parts[4] != "joined" {
		return "", fmt.Errorf("Invalid URL")
	}
	id := parts[5]
	id = strings.TrimSpace(id)
	return id, nil
}
