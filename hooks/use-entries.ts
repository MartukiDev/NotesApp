'use client'

import { useState, useCallback, useRef } from 'react'
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from '@/lib/api/entries'
import { syncEntryTags } from '@/lib/api/tags'
import type { Entry } from '@/lib/types'

const AUTOSAVE_DELAY = 700 // ms

interface UseEntriesReturn {
  entries: Entry[]
  loading: boolean
  error: string | null
  fetchEntries: (notebookId: string) => Promise<void>
  addEntry: (userId: string, notebookId: string) => Promise<Entry | null>
  saveEntry: (userId: string, entry: Entry) => void     // debounced auto-save
  removeEntry: (entryId: string) => Promise<void>
}

export function useEntries(): UseEntriesReturn {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchEntries = useCallback(async (notebookId: string) => {
    // Limpiar inmediatamente para no mostrar entries del notebook anterior
    setEntries([])
    setLoading(true)
    const { data, error } = await getEntries(notebookId)
    if (error) setError(error)
    else setEntries(data ?? [])
    setLoading(false)
  }, [])

  const addEntry = useCallback(
    async (userId: string, notebookId: string): Promise<Entry | null> => {
      const { data, error } = await createEntry(userId, notebookId)
      if (error) { setError(error); return null }
      setEntries((prev) => [data!, ...prev])
      return data
    },
    []
  )

  /**
   * Auto-save con debounce. Actualiza local inmediatamente y persiste
   * en Supabase después de AUTOSAVE_DELAY ms sin nuevos cambios.
   */
  const saveEntry = useCallback((userId: string, entry: Entry) => {
    // Optimistic: actualiza local de inmediato
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...entry, updatedAt: new Date() } : e))
    )

    // Cancela debounce anterior
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const [entryResult, tagsResult] = await Promise.all([
        updateEntry(entry.id, { title: entry.title, content: entry.content }),
        syncEntryTags(userId, entry.id, entry.tags),
      ])

      if (entryResult.error) setError(entryResult.error)
      if (tagsResult.error) setError(tagsResult.error)
    }, AUTOSAVE_DELAY)
  }, [])

  const removeEntry = useCallback(async (entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId))
    const { error } = await deleteEntry(entryId)
    if (error) setError(error)
  }, [])

  return { entries, loading, error, fetchEntries, addEntry, saveEntry, removeEntry }
}
