package models

type  Error struct {
	Message    string
	Code       int
	UserErrors UserError
}