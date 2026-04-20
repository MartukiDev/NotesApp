// ─────────────────────────────────────────────
// Tipos de UI — usados por todos los componentes
// ─────────────────────────────────────────────

export interface Entry {
  id: string
  notebookId: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Notebook {
  id: string
  name: string
  isJournal?: boolean
}

export interface Tag {
  id: string
  name: string
}

export type FilterType = 'all' | 'date' | 'tags'

// ─────────────────────────────────────────────
// Helpers de transformación
// ─────────────────────────────────────────────

/** Convierte timestamp string de Supabase a Date */
export function toDate(s: string): Date {
  return new Date(s)
}

/** Convierte una fila de DB a tipo Entry de UI */
export function dbEntryToEntry(
  row: {
    id: string
    notebook_id: string
    title: string
    content: string
    created_at: string
    updated_at: string
  },
  tags: string[] = []
): Entry {
  return {
    id: row.id,
    notebookId: row.notebook_id,
    title: row.title,
    content: row.content,
    tags,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  }
}

/** Convierte una fila de DB a tipo Notebook de UI */
export function dbNotebookToNotebook(row: {
  id: string
  name: string
  is_journal: boolean
}): Notebook {
  return {
    id: row.id,
    name: row.name,
    isJournal: row.is_journal,
  }
}
