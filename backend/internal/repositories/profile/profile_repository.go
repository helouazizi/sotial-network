package profile

import (
	"database/sql"

	"github.com/ismailsayen/social-network/internal/models"
)

type ProfileRepository struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (repo *ProfileRepository) GetMyProfile(sessionID int, profile *models.CommunInfoProfile) (*models.CommunInfoProfile, error) {
	// query := `
	// 	SELECT 
	// 	u.id,
	// 	u.nickname,
	// 	u.last_name,
	// 	u.first_name,
	// 	u.email,
	// 	u.date_of_birth,
	// 	u.is_private,
	// 	u.about_me,
	// 	COUNT(DISTINCT f1.follower_id) AS followers,
	// 	COUNT(DISTINCT f2.followed_id) AS followed,
	// 	COUNT(DISTINCT p.id) AS nbPosts
	// FROM users u
	// LEFT JOIN followers f1 ON u.id = f1.followed_id AND f1.status = 'accepted'
	// LEFT JOIN followers f2 ON u.id = f2.follower_id AND f2.status = 'accepted'
	// LEFT JOIN posts p ON u.id = p.user_id
	// WHERE u.id = ?
	// GROUP BY u.id;
	// `
	return profile, nil
}
