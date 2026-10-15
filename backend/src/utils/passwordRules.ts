export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain a capital letter.";
  if (!/[^A-Za-z0-9\s]/.test(password)) return "Password must contain a special symbol.";
  return null;
};