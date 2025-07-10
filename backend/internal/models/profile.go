package models

type CommunInfoProfile struct {
	User         User
	IsPrivate    int           `json:"is_private"`
	Followers    int           `json:"followers"`
	Followed     int           `json:"followed"`
	NbPosts      int           `json:"nbPosts"`
	MyAcount     bool          `json:"myAccount"`
	Posts        []Post        `json:"posts,omitempty"`
	ImFollower   bool          `json:"im_follower"`
	Subscription *Subscription `json:"subscription,omitempty"`
	IdRequest    int           `json:"request_id,omitempty"`
}
type Subscription struct {
	FollowerID int    `json:"follower_id"`
	FollowedID int    `json:"followed_id"`
	Status     string `json:"status"`
}
type UpdateVsibility struct {
	To int `json:"to"`
}


