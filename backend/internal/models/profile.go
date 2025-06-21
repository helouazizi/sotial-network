package models

type CommunInfoProfile struct {
	Id          int    `json:"id"`
	Nickname    string `json:"nickname"`
	LastName    string `json:"last_name"`
	FirstName   string `json:"first_name"`
	Email       string `json:"email"`
	DateOfBirth string `json:"date_of_birth"`
	IsPrivate   int    `json:"is_private"`
	AboutMe     string `json:"about_me"`
	Followers   int    `json:"followers"`
	Followed    int    `json:"followed"`
	NbPosts     int    `json:"nbPosts"`
	MyAcount    bool   `json:"myAccount"`
}
