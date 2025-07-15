package services

import "github.com/ismailsayen/social-network/internal/models"

func (s *GroupService) GetInfoGroupeService(grpId string, sessionID int) (*models.Group, error) {
	return s.repo.GetInfoGroupeRepo(grpId, sessionID)
}

func (s *GroupService) GetGroupMessagesService(grpId string) ([]models.GroupMessages, error) {
	return s.repo.GetGroupMessagesRepo(grpId)
}
