'use client'

import { Trash2 } from 'lucide-react'
import type { Entry } from '@/lib/types'

interface EntryItemProps {
  entry: Entry
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit' })
  }
  if (days === 1) return 'Ayer'
  if (days < 7) return date.toLocaleDateString('es-ES', { weekday: 'short' })
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

export function EntryItem({ entry, isActive, onClick, onDelete }: EntryItemProps) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={`w-full px-4 py-4 sm:py-3 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-inset ${
          isActive ? 'bg-secondary' : 'hover:bg-secondary/50'
        }`}
      >
        <div className="flex items-start justify-between gap-2 pr-8">
          <h3 className="text-sm font-medium leading-tight truncate">
            {entry.title || <span className="text-muted-foreground italic">Sin título</span>}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDate(entry.updatedAt)}
          </span>
        </div>
        {/* Fix: solo line-clamp-2, sin slice manual redundante */}
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {entry.content || <span className="italic">Sin contenido</span>}
        </p>

        {entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block max-w-[80px] truncate rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                title={tag}
              >
                {tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{entry.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        aria-label="Eliminar entrada"
        className="absolute right-2 top-3 sm:top-2 flex md:hidden md:group-hover:flex items-center justify-center rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
