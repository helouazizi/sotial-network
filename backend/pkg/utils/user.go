package utils

import "strings"

// Check if the password is valid
func ValidPass(Password string) bool {
	
	// Check if password length is between 8 and 15 characters
	if len(Password) < 8 || len(Password) > 15 {
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
