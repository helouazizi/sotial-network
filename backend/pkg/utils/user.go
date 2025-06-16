package utils

import (
	"regexp"
	"strings"
	"unicode"
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

	// Check length constraints
	if len(Username) <= 3 || len(Username) >= 64 {
		return false
	}

	// Convert to lowercase and trim spaces
	Username = strings.ToLower(Username)
	Username = strings.TrimSpace(Username)

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
