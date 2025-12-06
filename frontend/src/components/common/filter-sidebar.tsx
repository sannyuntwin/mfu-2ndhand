'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface FilterSidebarProps {
  onFilter: (filters: any) => void
}

export function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const filters = {
      minPrice: formData.get('minPrice'),
      maxPrice: formData.get('maxPrice'),
    }
    onFilter(filters)
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Filters</h3>
      <form onSubmit={handleFilter} className="space-y-4">
        <div>
          <label htmlFor="minPrice">Min Price</label>
          <Input id="minPrice" name="minPrice" type="number" />
        </div>
        <div>
          <label htmlFor="maxPrice">Max Price</label>
          <Input id="maxPrice" name="maxPrice" type="number" />
        </div>
        <Button type="submit" className="w-full">Apply Filters</Button>
      </form>
    </Card>
  )
}