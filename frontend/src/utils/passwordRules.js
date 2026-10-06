export const passwordRules = [
  { id: 'length',  label: 'At least 8 characters',                test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'One capital letter',                   test: (p) => /[A-Z]/.test(p) },
  { id: 'special', label: 'One special symbol (e.g. ! @ # $ %)',  test: (p) => /[^A-Za-z0-9\s]/.test(p) },
]

export const isPasswordValid = (password) =>
  passwordRules.every((rule) => rule.test(password))