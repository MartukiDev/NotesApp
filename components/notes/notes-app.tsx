'use client'

import { useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useNotebooks } from '@/hooks/use-notebooks'
import { useEntries } from '@/hooks/use-entries'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { EntryList } from './entry-list'
import { Editor } from './editor'
import type { Entry, Notebook, FilterType } from '@/lib/types'

// ─────────────────────────────────────────────
// Estado y Reducer — sin cambios
// ─────────────────────────────────────────────

interface AppState {
  activeNotebookId: string
  activeEntryId: string | null
  searchQuery: string
  activeFilter: FilterType
}

type AppAction =
  | { type: 'SET_ACTIVE_NOTEBOOK'; notebookId: string }
  | { type: 'SET_ACTIVE_ENTRY'; entryId: string | null }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_FILTER'; filter: FilterType }

const initialState: AppState = {
  activeNotebookId: '',
  activeEntryId: null,
  searchQuery: '',
  activeFilter: 'all',
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_NOTEBOOK':
      return {
        ...state,
        activeNotebookId: action.notebookId,
        activeEntryId: null,
        searchQuery: '',
        activeFilter: 'all',
      }
    case 'SET_ACTIVE_ENTRY':
      return { ...state, activeEntryId: action.entryId }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query }
    case 'SET_FILTER':
      return { ...state, activeFilter: action.filter }
    default:
      return state
  }
}

// ─────────────────────────────────────────────
// Helpers de filtrado — sin cambios
// ─────────────────────────────────────────────

function isThisWeek(date: Date): boolean {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return date >= weekAgo && date <= now
}

function applyFilters(
  entries: Entry[],
  searchQuery: string,
  activeFilter: FilterType
): Entry[] {
  let filtered = [...entries]

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query) ||
        e.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  if (activeFilter === 'date') {
    filtered = filtered.filter((e) => isThisWeek(e.updatedAt))
  }

  if (activeFilter === 'tags') {
    filtered = filtered.filter((e) => e.tags.length > 0)
  }

  return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export function NotesApp() {
  const router = useRouter()
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { activeNotebookId, activeEntryId, searchQuery, activeFilter } = state

  // ── Datos reales desde Supabase ──
  const {
    notebooks,
    fetchNotebooks,
    addNotebook,
    renameNotebookById,
    deleteNotebookById,
  } = useNotebooks()

  const {
    entries,
    fetchEntries,
    addEntry,
    saveEntry,
    removeEntry,
  } = useEntries()

  // ── Modificadores Mobile ──
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ── Usuario autenticado ──
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      fetchNotebooks(user.id)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Seleccionar primer notebook automáticamente ──
  useEffect(() => {
    if (notebooks.length > 0 && !activeNotebookId) {
      dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId: notebooks[0].id })
    }
  }, [notebooks, activeNotebookId])

  // ── Cargar entries cuando cambia el notebook activo ──
  useEffect(() => {
    if (activeNotebookId) {
      fetchEntries(activeNotebookId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNotebookId])

  // ── Derivados ──
  const activeNotebook = useMemo(
    () => notebooks.find((n) => n.id === activeNotebookId) ?? null,
    [notebooks, activeNotebookId]
  )

  const activeEntry = useMemo(
    () => entries.find((e) => e.id === activeEntryId) ?? null,
    [entries, activeEntryId]
  )

  const filteredEntries = useMemo(
    () => applyFilters(entries, searchQuery, activeFilter),
    [entries, searchQuery, activeFilter]
  )

  // ── Handlers de Notebook ──
  const handleNotebookClick = useCallback((notebookId: string) => {
    dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId })
    if (isMobile) setIsSidebarOpen(false)
  }, [isMobile])

  const handleNewNotebook = useCallback(async (name: string, isJournal: boolean) => {
    if (!userId) return
    const notebook = await addNotebook(userId, name, isJournal)
    if (notebook) {
      dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId: notebook.id })
    }
  }, [userId, addNotebook])

  const handleRenameNotebook = useCallback(
    async (notebookId: string, name: string) => {
      if (!name.trim()) return
      await renameNotebookById(notebookId, name.trim())
    },
    [renameNotebookById]
  )

  const handleDeleteNotebook = useCallback(
    async (notebookId: string) => {
      if (notebooks.length <= 1) return
      await deleteNotebookById(notebookId)
      const remaining = notebooks.filter((n) => n.id !== notebookId)
      if (remaining.length > 0) {
        dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId: remaining[0].id })
      }
    },
    [notebooks, deleteNotebookById]
  )

  // ── Handlers de Entry ──
  const handleEntryClick = useCallback((entry: Entry) => {
    dispatch({ type: 'SET_ACTIVE_ENTRY', entryId: entry.id })
  }, [])

  const handleNewEntry = useCallback(async () => {
    if (!userId || !activeNotebookId) return
    const entry = await addEntry(userId, activeNotebookId)
    if (entry) {
      dispatch({ type: 'SET_ACTIVE_ENTRY', entryId: entry.id })
    }
  }, [userId, activeNotebookId, addEntry])

  const handleEntryUpdate = useCallback(
    (updatedEntry: Entry) => {
      if (!userId) return
      saveEntry(userId, updatedEntry)
    },
    [userId, saveEntry]
  )

  const handleDeleteEntry = useCallback(
    async (entryId: string) => {
      await removeEntry(entryId)
      if (activeEntryId === entryId) {
        dispatch({ type: 'SET_ACTIVE_ENTRY', entryId: null })
      }
    },
    [activeEntryId, removeEntry]
  )

  const handleEditorClose = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_ENTRY', entryId: null })
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [router])

  return (
    <div className="flex h-screen w-full bg-background text-foreground relative overflow-hidden">
      {/* Overlay para Sidebar en Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        notebooks={notebooks}
        activeNotebookId={activeNotebookId}
        onNotebookClick={handleNotebookClick}
        onNewNotebook={handleNewNotebook}
        onRenameNotebook={handleRenameNotebook}
        onDeleteNotebook={handleDeleteNotebook}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <TopBar
          notebookName={activeNotebook?.name ?? ''}
          searchQuery={searchQuery}
          onSearchChange={(query) => dispatch({ type: 'SET_SEARCH', query })}
          activeFilter={activeFilter}
          onFilterChange={(filter) => dispatch({ type: 'SET_FILTER', filter })}
          onMenuClick={isMobile ? () => setIsSidebarOpen(true) : undefined}
        />
        <div className="flex flex-1 overflow-hidden relative w-full">
          {(!isMobile || !activeEntryId) && (
            <div className={`h-full border-r border-border shrink-0 ${isMobile ? 'w-full' : 'w-72'}`}>
              <EntryList
                entries={filteredEntries}
                activeEntryId={activeEntryId}
                onEntryClick={handleEntryClick}
                onNewEntry={handleNewEntry}
                onDeleteEntry={handleDeleteEntry}
                notebook={activeNotebook}
              />
            </div>
          )}
          {(!isMobile || activeEntryId) && (
            <div className={`h-full flex-1 min-w-0 ${isMobile ? 'absolute inset-0 bg-background z-10 w-full' : ''}`}>
              <Editor
                entry={activeEntry}
                onClose={handleEditorClose}
                onUpdate={handleEntryUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
