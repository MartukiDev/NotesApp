'use client'

import { useEffect, useState } from 'react'
import { X, ChevronLeft } from 'lucide-react'
import { TagInput } from './tag-input'
import type { Entry } from '@/lib/types'

interface EditorProps {
  entry: Entry | null
  onClose: () => void
  onUpdate: (entry: Entry) => void
}

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function Editor({ entry, onClose, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [tags, setTags] = useState<string[]>(entry?.tags || [])
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  useEffect(() => {
    if (entry) {
      setTitle(entry.title)
      setContent(entry.content)
      setTags(entry.tags)
      setSaveStatus('saved')
    }
  }, [entry])

  useEffect(() => {
    if (!entry) return

    const hasChanges =
      title !== entry.title ||
      content !== entry.content ||
      JSON.stringify(tags) !== JSON.stringify(entry.tags)

    if (hasChanges) {
      setSaveStatus('saving')
      const timeout = setTimeout(() => {
        onUpdate({
          ...entry,
          title,
          content,
          tags,
          updatedAt: new Date(),
        })
        setSaveStatus('saved')
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [title, content, tags, entry, onUpdate])

  if (!entry) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-sm">Selecciona una entrada para empezar a escribir</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 shrink-0 h-14">
        <div className="flex items-center gap-2">
          {/* Botón atrás en móvil */}
          <button
            onClick={onClose}
            className="md:hidden flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-md active:bg-secondary"
            aria-label="Volver a la lista"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="hidden md:inline text-xs text-muted-foreground">
            {formatTimestamp(entry.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'saved' ? 'Guardado' : ''}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sin título"
          className="w-full bg-transparent text-xl font-medium placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="mt-4">
          <TagInput tags={tags} onChange={setTags} />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Empieza a escribir..."
          className="mt-4 pb-32 min-h-[500px] w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  )
}
