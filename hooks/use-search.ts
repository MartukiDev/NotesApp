'use client'

import { useState, useCallback, useRef } from 'react'
import { searchEntries } from '@/lib/api/entries'
import type { Entry } from '@/lib/types'

const SEARCH_DELAY = 300 // ms

interface UseSearchReturn {
  results: Entry[] | null   // null = sin búsqueda activa
  searching: boolean
  search: (userId: string, query: string) => void
  clearSearch: () => void
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<Entry[] | null>(null)
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((userId: string, query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults(null)
      setSearching(false)
      return
    }

    setSearching(true)

    debounceRef.current = setTimeout(async () => {
      const { data } = await searchEntries(userId, query)
      setResults(data ?? [])
      setSearching(false)
    }, SEARCH_DELAY)
  }, [])

  const clearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setResults(null)
    setSearching(false)
  }, [])

  return { results, searching, search, clearSearch }
}
