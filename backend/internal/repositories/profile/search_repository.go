package profile

import "github.com/ismailsayen/social-network/internal/models"

func (repo *ProfileRepository)SerchProfile(data string) ([]models.User, error) {
	
	query :=`SELECT id, last_name, first_name,  nickname, avatar FROM users
WHERE LOWER(first_name) LIKE $1
   OR LOWER(last_name) LIKE $1
   OR LOWER(nickname) LIKE $1
   `
   var users []models.User 
   rows, err := repo.db.Query(query,data)
   if err != nil {
	return []models.User{}, err
   }
   for rows.Next(){
	var user  models.User
	err := rows.Scan( &user.ID ,&user.Lastname, &user.FirstName,&user.Nickname, &user.Avatar)
	if err != nil {
		return  []models.User{}, err
	}
	users= append(users, user)


   }

	return users, nil

}