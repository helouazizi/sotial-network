package models

type CommunInfoProfile struct {
	Id           int           `json:"id"`
	Nickname     string        `json:"nickname"`
	LastName     string        `json:"last_name"`
	FirstName    string        `json:"first_name"`
	Email        string        `json:"email,omitempty"`
	Avatar       string        `json:"avatar,omitempty"`
	DateOfBirth  string        `json:"date_of_birth,omitempty"`
	IsPrivate    int           `json:"is_private"`
	AboutMe      string        `json:"about_me,omitempty"`
	Followers    int           `json:"followers"`
	Followed     int           `json:"followed"`
	NbPosts      int           `json:"nbPosts"`
	MyAcount     bool          `json:"myAccount"`
	Posts        []Post        `json:"posts,omitempty"`
	ImFollower   bool          `json:"im_follower"`
	Subscription *Subscription `json:"subscription,omitempty"`
}
type Subscription struct {
	FollowerID int    `json:"follower_id"`
	FollowedID int    `json:"followed_id"`
	Status     string `json:"status"`
}
type UpdateVsibility struct {
	To int `json:"to"`
}
