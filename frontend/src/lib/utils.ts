// Helper functions
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}