package requests

import "github.com/ismailsayen/social-network/internal/repositories/requests"

type RequestsService struct {
	reqRepo *requests.RequestRepos
}

func NewRequestsService(reqRepo *requests.RequestRepos) *RequestsService {
	return &RequestsService{reqRepo: reqRepo}
}
