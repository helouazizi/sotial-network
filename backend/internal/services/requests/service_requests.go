package requests

import "github.com/ismailsayen/social-network/internal/repositories/requests"

type RequestsService struct {
	reqRepo *requests.RequestRepos
}

func NewRequestsService(reqRepo *requests.RequestRepos) *RequestsService {
	return &RequestsService{reqRepo: reqRepo}
}

func (reqSer *RequestsService) NumberOfRequests(sessionID int) (int, int, error) {
	return reqSer.reqRepo.GetNumsofRequests(sessionID)
}
