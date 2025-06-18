package token

import "github.com/google/uuid"



func GenerateToken()(string,error){
	token, err :=uuid.NewV7()
	if err!= nil {
		return "", err
	}
	return token.String(), nil
}