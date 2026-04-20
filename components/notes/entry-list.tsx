'use client'

import { Plus } from 'lucide-react'
import { EntryItem } from './entry-item'
import type { Entry, Notebook } from '@/lib/types'

interface EntryListProps {
  entries: Entry[]
  activeEntryId: string | null
  onEntryClick: (entry: Entry) => void
  onNewEntry: () => void
  onDeleteEntry: (entryId: string) => void
  notebook: Notebook | null
}

function groupEntriesByDate(entries: Entry[]): Map<string, Entry[]> {
  const groups = new Map<string, Entry[]>()
  entries.forEach((entry) => {
    const dateKey = entry.createdAt.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const existing = groups.get(dateKey) ?? []
    groups.set(dateKey, [...existing, entry])
  })
  return groups
}

// Header extraído — evita duplicación entre journal y regular
function ListHeader({
  count,
  label,
  onNewEntry,
}: {
  count: number
  label: string
  onNewEntry: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <span className="text-xs text-muted-foreground">
        {count} {count === 1 ? 'entrada' : 'entradas'}
      </span>
      <button
        onClick={onNewEntry}
        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        aria-label={label}
      >
        <Plus className="h-3.5 w-3.5" />
        {label}
      </button>
    </div>
  )
}

export function EntryList({
  entries,
  activeEntryId,
  onEntryClick,
  onNewEntry,
  onDeleteEntry,
  notebook,
}: EntryListProps) {
  const isJournal = notebook?.isJournal

  if (isJournal) {
    const grouped = groupEntriesByDate(entries)

    return (
      <div className="flex h-full flex-col">
        <ListHeader
          count={entries.length}
          label="Nueva entrada"
          onNewEntry={onNewEntry}
        />
        <div className="flex-1 overflow-y-auto">
          {Array.from(grouped.entries()).map(([date, dateEntries]) => (
            <div key={date}>
              <div className="sticky top-0 bg-background px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">{date}</span>
              </div>
              <div className="divide-y divide-border/50">
                {dateEntries.map((entry) => (
                  <EntryItem
                    key={entry.id}
                    entry={entry}
                    isActive={entry.id === activeEntryId}
                    onClick={() => onEntryClick(entry)}
                    onDelete={() => onDeleteEntry(entry.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ListHeader
        count={entries.length}
        label="Nueva nota"
        onNewEntry={onNewEntry}
      />
      <div className="flex-1 divide-y divide-border/50 overflow-y-auto">
        {entries.map((entry) => (
          <EntryItem
            key={entry.id}
            entry={entry}
            isActive={entry.id === activeEntryId}
            onClick={() => onEntryClick(entry)}
            onDelete={() => onDeleteEntry(entry.id)}
          />
        ))}
      </div>
    </div>
  )
}
