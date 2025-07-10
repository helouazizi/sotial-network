package models

import "mime/multipart"

type User struct {
	ID          int                   `json:"id,omitempty"`
	Nickname    string                `json:"nickname,omitempty"`
	Email       string                `json:"email,omitempty"`
	PassWord    string                `json:"password,omitempty"`
	FirstName   string                `json:"firstname,omitempty"`
	Lastname    string                `json:"lastname,omitempty"`
	DateofBirth string                `json:"dateofbirth,omitempty"`
	AboutMe     string                `json:"aboutme,omitempty"`
	Avatar      string                `json:"avatar,omitempty"`
	File        multipart.File        `json:"file,omitempty"`
	Header      *multipart.FileHeader `json:"header,omitempty"`
	FileErr     error                 `json:"file_err,omitempty"`
	Token       string                `json:"token,omitempty"`
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
