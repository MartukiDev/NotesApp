'use client'

import { useState, useCallback } from 'react'
import {
  getNotebooks,
  createNotebook,
  renameNotebook,
  deleteNotebook,
} from '@/lib/api/notebooks'
import type { Notebook } from '@/lib/types'

interface UseNotebooksReturn {
  notebooks: Notebook[]
  loading: boolean
  error: string | null
  fetchNotebooks: (userId: string) => Promise<void>
  addNotebook: (userId: string, name: string, isJournal?: boolean) => Promise<Notebook | null>
  renameNotebookById: (id: string, name: string) => Promise<void>
  deleteNotebookById: (id: string) => Promise<void>
}

export function useNotebooks(): UseNotebooksReturn {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotebooks = useCallback(async (userId: string) => {
    setLoading(true)
    const { data, error } = await getNotebooks(userId)
    if (error) setError(error)
    else setNotebooks(data ?? [])
    setLoading(false)
  }, [])

  const addNotebook = useCallback(
    async (userId: string, name: string, isJournal = false): Promise<Notebook | null> => {
      const { data, error } = await createNotebook(userId, name, isJournal)
      if (error) { setError(error); return null }
      setNotebooks((prev) => [...prev, data!])
      return data
    },
    []
  )

  const renameNotebookById = useCallback(async (id: string, name: string) => {
    // Optimistic update
    setNotebooks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, name } : n))
    )
    const { error } = await renameNotebook(id, name)
    if (error) setError(error)
  }, [])

  const deleteNotebookById = useCallback(async (id: string) => {
    // Optimistic update
    setNotebooks((prev) => prev.filter((n) => n.id !== id))
    const { error } = await deleteNotebook(id)
    if (error) setError(error)
  }, [])

  return {
    notebooks,
    loading,
    error,
    fetchNotebooks,
    addNotebook,
    renameNotebookById,
    deleteNotebookById,
  }
}
