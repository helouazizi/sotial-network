package models

import "mime/multipart"

type User struct {
	ID          int
	Nickname    string `json:"nickname"`
	Email       string `json:"email"`
	PassWord    string `json:"password"`
	FirstName   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	DateofBirth string `json:"dateofbirth"`
	AboutMe     string `json:"aboutme"`
	Avatar      string `json:"avatar"`
	File        multipart.File
	Header      *multipart.FileHeader
	FileErr     error
	Token       string
}

type UserError struct {
	Nickname    string
	Email       string
	PassWord    string
	FirstName   string
	Lastname    string
	DateofBirth string
	AboutMe     string
	HasErro     bool
}

type UserCredential struct {
	Email string
	Pass  string
	Token string
}
