package models

type Error struct {
	Message    string
	Code       int
	UserErrors UserError
}

type GroupError struct {
	Message string
	Code    int
}
