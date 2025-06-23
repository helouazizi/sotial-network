package models

type CommunInfoProfile struct {
	Id           int           `json:"id"`
	Nickname     string        `json:"nickname"`
	LastName     string        `json:"last_name"`
	FirstName    string        `json:"first_name"`
	Email        string        `json:"email"`
	Avatar       string        `json:"avatar"`
	DateOfBirth  string        `json:"date_of_birth"`
	IsPrivate    int           `json:"is_private"`
	AboutMe      string        `json:"about_me"`
	Followers    int           `json:"followers"`
	Followed     int           `json:"followed"`
	NbPosts      int           `json:"nbPosts"`
	MyAcount     bool          `json:"myAccount"`
	Posts        []Post        `json:"posts"`
	ImFollower   bool          `json:"im_follower"`
	Subscription *Subscription `json:"subscription,omitempty"`
}
type Subscription struct {
	FollowerID int    `json:"follower_id"`
	FollowedID int    `json:"followed_id"`
	Status     string `json:"status"`
}
