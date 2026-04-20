'use client'

import { useState, useRef, useEffect } from 'react'
import { BookOpen, Plus, Book, Trash2, BookMarked, X, Check } from 'lucide-react'
import type { Notebook } from '@/lib/types'

interface NotebookListProps {
  notebooks: Notebook[]
  activeNotebookId: string
  onNotebookClick: (notebookId: string) => void
  onNewNotebook: (name: string, isJournal: boolean) => void
  onRenameNotebook: (notebookId: string, name: string) => void
  onDeleteNotebook: (notebookId: string) => void
}

interface NotebookItemProps {
  notebook: Notebook
  isActive: boolean
  canDelete: boolean
  onClick: () => void
  onRename: (name: string) => void
  onDelete: () => void
}

function NotebookItem({
  notebook,
  isActive,
  canDelete,
  onClick,
  onRename,
  onDelete,
}: NotebookItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(notebook.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const commitRename = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== notebook.name) {
      onRename(trimmed)
    } else {
      setEditValue(notebook.name)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') {
      setEditValue(notebook.name)
      setIsEditing(false)
    }
  }

  const Icon = notebook.isJournal ? BookOpen : Book

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 bg-secondary">
        <Icon className="h-4 w-4 shrink-0 text-foreground" />
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitRename}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent text-sm text-foreground focus:outline-none"
        />
      </div>
    )
  }

  return (
    <div className="group relative flex items-center">
      <button
        onClick={onClick}
        onDoubleClick={() => setIsEditing(true)}
        title="Doble clic para renombrar"
        className={`flex flex-1 min-w-0 items-center gap-2 rounded-md pl-2 pr-9 py-1.5 text-left text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${
          isActive
            ? 'bg-secondary text-foreground'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{notebook.name}</span>
      </button>

      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label={`Eliminar ${notebook.name}`}
          className="absolute right-1.5 flex md:hidden md:group-hover:flex items-center justify-center rounded p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-sidebar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Formulario inline para crear notebook
// ─────────────────────────────────────────────

interface NewNotebookFormProps {
  onConfirm: (name: string, isJournal: boolean) => void
  onCancel: () => void
}

function NewNotebookForm({ onConfirm, onCancel }: NewNotebookFormProps) {
  const [name, setName] = useState('')
  const [isJournal, setIsJournal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onConfirm(trimmed, isJournal)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="rounded-md border border-border bg-secondary/50 p-2 space-y-2"
    >
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del notebook"
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      {/* Toggle Journal */}
      <button
        type="button"
        onClick={() => setIsJournal((v) => !v)}
        className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors ${
          isJournal
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <BookMarked className="h-3.5 w-3.5" />
        <span>Modo journal</span>
        <span className="ml-auto text-[10px] uppercase tracking-wide opacity-60">
          {isJournal ? 'activado' : 'desactivado'}
        </span>
      </button>

      {isJournal && (
        <p className="px-1 text-[11px] text-muted-foreground leading-snug">
          Las entradas se agrupan por fecha automáticamente.
        </p>
      )}

      <div className="flex items-center justify-end gap-1 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cancelar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Crear notebook"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  )
}

// ─────────────────────────────────────────────
// NotebookList
// ─────────────────────────────────────────────

export function NotebookList({
  notebooks,
  activeNotebookId,
  onNotebookClick,
  onNewNotebook,
  onRenameNotebook,
  onDeleteNotebook,
}: NotebookListProps) {
  const [showForm, setShowForm] = useState(false)

  const handleConfirm = (name: string, isJournal: boolean) => {
    onNewNotebook(name, isJournal)
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-0.5">
      {notebooks.map((notebook) => (
        <NotebookItem
          key={notebook.id}
          notebook={notebook}
          isActive={activeNotebookId === notebook.id}
          canDelete={notebooks.length > 1}
          onClick={() => onNotebookClick(notebook.id)}
          onRename={(name) => onRenameNotebook(notebook.id, name)}
          onDelete={() => onDeleteNotebook(notebook.id)}
        />
      ))}

      {showForm ? (
        <div className="mt-2">
          <NewNotebookForm
            onConfirm={handleConfirm}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo notebook</span>
        </button>
      )}
    </div>
  )
}
