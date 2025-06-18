package utils

import (
	"errors"
	"regexp"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"golang.org/x/crypto/bcrypt"
)

// Check if the password is valid
func ValidPass(Password string) bool {
	// Check if password length is between 8 and 15 characters
	if len(Password) <= 8 || len(Password) >= 15 {
		return false
	}

	hasNumber := false
	hasLowercase := false
	hasUppercase := false
	hasSpecialChar := false
	specialChars := "@#%&!$*"

	// Loop through each character in the password
	for _, val := range Password {
		// Check for numbers
		if val >= '0' && val <= '9' {
			hasNumber = true
		}
		// Check for lowercase letters
		if val >= 'a' && val <= 'z' {
			hasLowercase = true
		}
		// Check for uppercase letters
		if val >= 'A' && val <= 'Z' {
			hasUppercase = true
		}
		// Check for special characters
		if strings.ContainsRune(specialChars, val) {
			hasSpecialChar = true
		}
	}

	// Return true only if all conditions are met
	return hasNumber && hasLowercase && hasUppercase && hasSpecialChar
}

func ValidUsername(Username string) bool {
	// Define allowed characters (lowercase a-z, 0-9, -, _, ', .)
	validChar := "abcdefghijklmnopqrstuvwxyz0123456789-_.'"
	// Convert to lowercase and trim spaces
	Username = strings.ToLower(Username)
	Username = strings.TrimSpace(Username)
	// Check length constraints
	if len(Username) == 0 {
		return true
	}
	if len(Username) <= 3 || len(Username) >= 64 {
		return false
	}

	// Check if username starts or ends with a period (.)
	if Username[0] == '.' || Username[len(Username)-1] == '.' {
		return false
	}

	// Check for consecutive periods (..)
	if strings.Contains(Username, "..") {
		return false
	}

	// Loop through each character in the username
	for _, val := range Username {
		// Check if the character is valid
		if !strings.ContainsRune(validChar, val) {
			return false
		}
		// Check for invalid characters (e.g., & = < > + , !)
		if unicode.IsPunct(val) && !strings.ContainsRune(".-_'", val) {
			return false
		}
	}

	return true
}

func ValidEmail(Email string) bool {
	Email = strings.TrimSpace(Email)

	validemailregex := regexp.MustCompile(`^[A-Za-z0-9]+([._-]?[A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,63}$`)
	return validemailregex.MatchString(Email)
}

func ValidName(name string) bool {
	// Length check (1–100 chars)
	if len(name) < 1 || len(name) > 100 {
		return false
	}

	// Regex (ASCII only version)
	re := regexp.MustCompile(`^[A-Za-z]+([ '\-][A-Za-z]+)*$`)
	return re.MatchString(name)
}

func ValidDateOfBirth(dobstr string) error {
	dob, err := time.Parse("2006-01-02", dobstr)
	if err != nil {
		return errors.New("Invalid date format")
	}
	today := time.Now()
	if dob.After(today) {
		return errors.New("Subhan Allah you are not born yet back when you are born and have 13 years")
	}
	age := int(today.Sub(dob).Hours() / 24 / 365.25)
	if age < 13 {
		return errors.New("you should be at least  13 years")
	}
	if age > 120 {
		return errors.New("you arr to old for this ")
	}
	return nil
}

func ValidateAboutMe(input string) error {
	text := strings.TrimSpace(input)
	length := utf8.RuneCountInString(text)

	if length > 500 {
		return errors.New("Your 'About Me' section must be under 500 characters.")
	}

	// Optional: Reject links/emails
	if strings.Contains(text, "http://") || strings.Contains(text, "https://") || strings.Contains(text, "@") {
		return errors.New("Please avoid including links or email addresses.")
	}

	return nil
}

func HashPassWord(pass string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	return string(bytes), err
}

func ComparePass(hashed, pass []byte) error {
	return bcrypt.CompareHashAndPassword(hashed, pass)
}
