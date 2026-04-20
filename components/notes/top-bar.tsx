'use client'

import { Filter, Menu } from 'lucide-react'
import { SearchBar } from './search-bar'
import { ThemeToggle } from './theme-toggle'
import type { FilterType } from '@/lib/types'

interface TopBarProps {
  notebookName: string
  searchQuery: string
  onSearchChange: (value: string) => void
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  onMenuClick?: () => void
}

export function TopBar({
  notebookName,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onMenuClick,
}: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border px-4 w-full shrink-0">
      <div className="flex items-center gap-2 max-w-[40%]">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-md text-muted-foreground active:bg-secondary hover:bg-secondary/50 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-sm font-medium truncate">{notebookName}</h2>
      </div>
      <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
        <div className="w-full max-w-[150px] sm:max-w-[200px]">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => onFilterChange('all')}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              activeFilter === 'all'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('date')}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              activeFilter === 'date'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Date
          </button>
          <button
            onClick={() => onFilterChange('tags')}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
              activeFilter === 'tags'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Filter className="h-3 w-3" />
            Tags
          </button>
        </div>
        <div className="sm:ml-2 sm:border-l sm:border-border sm:pl-2 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
