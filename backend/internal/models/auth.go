package models


type User struct {
	ID  int  `json:"id"`
	Nickname string `json:"nickname"`
	Email string `json:"email"`
	PassWord string `json:"password"`
	FirstName string `json:"firstname"`
	Lastname string `json:"lastname"`
	DateofBirth string `json:"dateofbirth"`
	AboutMe  string `json:"aboutme"`
}
