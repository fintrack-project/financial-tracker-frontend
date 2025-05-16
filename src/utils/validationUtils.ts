/**
 * Validates if a password is strong.
 * A strong password must:
 * - Be at least 8 characters long
 * - Include at least one uppercase letter
 * - Include at least one lowercase letter
 * - Include at least one number
 * - Include at least one special character
 */
export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"|,.<>/?]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Validates if an email address is valid.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};