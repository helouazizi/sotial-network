package relations

import repositories "github.com/ismailsayen/social-network/internal/repositories/relations"

type RelationsServices struct {
	relationrepo *repositories.RelationsRepository
}

func NewRelationsServices(relationRepo *repositories.RelationsRepository) *RelationsServices {
	return &RelationsServices{relationrepo: relationRepo}
}
