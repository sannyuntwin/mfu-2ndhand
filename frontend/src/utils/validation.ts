// Input validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isValidPrice(price: number): boolean {
  return price > 0 && !isNaN(price)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}