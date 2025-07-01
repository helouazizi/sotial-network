package relations

import (
	"errors"

	"github.com/ismailsayen/social-network/internal/models"
	repositories "github.com/ismailsayen/social-network/internal/repositories/relations"
)

type RelationsServices struct {
	relationrepo *repositories.RelationsRepository
}

func NewRelationsServices(relationRepo *repositories.RelationsRepository) *RelationsServices {
	return &RelationsServices{relationrepo: relationRepo}
}

func (rs *RelationsServices) CheckRelation(data *models.RealtionUpdate, sessionID int) (map[string]any, error) {
	var newStatus string
	var haveAccess bool
	Visibility, err := rs.relationrepo.GetActuelStatus(data.ProfileID)
	if err != nil {
		return nil, err
	}
	switch data.ActuelStatus {
	case "follow":
		if Visibility == 1 {
			newStatus = "pending"
			haveAccess = false
		} else if Visibility == 0 {
			newStatus = "accepted"
			haveAccess = true
		}

	case "accepted":
		newStatus = "follow"
		haveAccess = (Visibility == 0)

	case "pending":
		newStatus = "follow"
		haveAccess = false
	default:

		return nil, errors.New("Invalid Request Data")
	}
	err = rs.relationrepo.UpdateRelation(newStatus, data.ProfileID, sessionID, haveAccess)
	if err != nil {
		return nil, err
	}
	NewRelation := map[string]any{
		"newStatus":  newStatus,
		"haveAccess": haveAccess,
	}
	return NewRelation, nil
}

func (rs *RelationsServices) GetRealtionsServives(info *models.GetUsers) error {
	var columun string
	var userColumun string
	if info.Type == "followers" {
		columun = "f.followed_id"
		userColumun = "follower_id"
	} else if info.Type == "followed" {
		columun = "f.follower_id"
		userColumun = "f.followed_id"
	}
	return rs.relationrepo.GetUserRelations(info, columun,userColumun)
}
