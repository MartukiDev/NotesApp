import { supabase } from '@/lib/supabase'
import { dbNotebookToNotebook } from '@/lib/types'
import type { Notebook } from '@/lib/types'

// ─────────────────────────────────────────────
// Notebooks API
// ─────────────────────────────────────────────

export async function getNotebooks(userId: string): Promise<{
  data: Notebook[] | null
  error: string | null
}> {
  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) return { data: null, error: error.message }
  return { data: data.map(dbNotebookToNotebook), error: null }
}

export async function createNotebook(
  userId: string,
  name: string,
  isJournal = false
): Promise<{ data: Notebook | null; error: string | null }> {
  const { data, error } = await supabase
    .from('notebooks')
    .insert({ user_id: userId, name, is_journal: isJournal })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: dbNotebookToNotebook(data), error: null }
}

export async function renameNotebook(
  id: string,
  name: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('notebooks')
    .update({ name })
    .eq('id', id)

  return { error: error?.message ?? null }
}

export async function deleteNotebook(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('notebooks').delete().eq('id', id)
  return { error: error?.message ?? null }
}
