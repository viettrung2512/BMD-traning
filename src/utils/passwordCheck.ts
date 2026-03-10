const passwordCheck = (password: string): string => {
    // Check if password is empty
    if (!password) {
        return "Password cannot be empty";
    }
    
    // Check length
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    
    // Check for digit
    if (!/\d/.test(password)) {
        return "Password must contain at least one digit";
    }
    
    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain at least one special character";
    }
    
    return "Password is valid";
}

export default passwordCheck;