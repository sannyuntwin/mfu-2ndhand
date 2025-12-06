'use client'

interface CheckoutFormProps {
  onSubmit: (data: any) => void
  loading?: boolean
}

export function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    onSubmit({
      shippingAddress: formData.get('shippingAddress'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Shipping Address</label>
        <textarea
          name="shippingAddress"
          required
          className="w-full border p-2"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}