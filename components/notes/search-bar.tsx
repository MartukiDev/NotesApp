'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search entries..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border-0 bg-secondary/50 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
