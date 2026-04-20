import { supabase } from '@/lib/supabase'
import { dbEntryToEntry } from '@/lib/types'
import type { Entry } from '@/lib/types'

// ─────────────────────────────────────────────
// Entries API
// ─────────────────────────────────────────────

export async function getEntries(notebookId: string): Promise<{
  data: Entry[] | null
  error: string | null
}> {
  const { data, error } = await supabase
    .from('entries')
    .select(`
      *,
      entry_tags (
        tags ( name )
      )
    `)
    .eq('notebook_id', notebookId)
    .order('updated_at', { ascending: false })

  if (error) return { data: null, error: error.message }

  const entries = data.map((row) => {
    const tags = (row.entry_tags as { tags: { name: string } | null }[])
      .map((et) => et.tags?.name)
      .filter((n): n is string => Boolean(n))

    return dbEntryToEntry(row, tags)
  })

  return { data: entries, error: null }
}

export async function createEntry(
  userId: string,
  notebookId: string,
  title = '',
  content = ''
): Promise<{ data: Entry | null; error: string | null }> {
  const { data, error } = await supabase
    .from('entries')
    .insert({ user_id: userId, notebook_id: notebookId, title, content })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: dbEntryToEntry(data), error: null }
}

export async function updateEntry(
  id: string,
  patch: { title?: string; content?: string }
): Promise<{ error: string | null }> {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('entries')
    .update({ ...patch, updated_at: now })
    .eq('id', id)

  return { error: error?.message ?? null }
}

export async function deleteEntry(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('entries').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function searchEntries(
  userId: string,
  query: string
): Promise<{ data: Entry[] | null; error: string | null }> {
  const q = `%${query}%`
  const { data, error } = await supabase
    .from('entries')
    .select(`
      *,
      entry_tags (
        tags ( name )
      )
    `)
    .eq('user_id', userId)
    .or(`title.ilike.${q},content.ilike.${q}`)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (error) return { data: null, error: error.message }

  const entries = data.map((row) => {
    const tags = (row.entry_tags as { tags: { name: string } | null }[])
      .map((et) => et.tags?.name)
      .filter((n): n is string => Boolean(n))

    return dbEntryToEntry(row, tags)
  })

  return { data: entries, error: null }
}
