// Toast hook - implement with your toast library
export function useToast() {
  return {
    toast: (message: string) => alert(message), // placeholder
  }
}