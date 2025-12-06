// Simple dialog components
export function Dialog({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      {children}
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600">{children}</p>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>
}