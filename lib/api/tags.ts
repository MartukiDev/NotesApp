import { supabase } from '@/lib/supabase'
import type { Tag } from '@/lib/types'

// ─────────────────────────────────────────────
// Tags API
// ─────────────────────────────────────────────

export async function getTags(userId: string): Promise<{
  data: Tag[] | null
  error: string | null
}> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createTag(
  userId: string,
  name: string
): Promise<{ data: Tag | null; error: string | null }> {
  // Upsert: si ya existe con ese nombre para el usuario, lo retorna
  const { data, error } = await supabase
    .from('tags')
    .upsert({ user_id: userId, name }, { onConflict: 'user_id,name' })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function deleteTag(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('tags').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function assignTag(
  entryId: string,
  tagId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('entry_tags')
    .upsert({ entry_id: entryId, tag_id: tagId })

  return { error: error?.message ?? null }
}

export async function removeTag(
  entryId: string,
  tagId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('entry_tags')
    .delete()
    .eq('entry_id', entryId)
    .eq('tag_id', tagId)

  return { error: error?.message ?? null }
}

export async function syncEntryTags(
  userId: string,
  entryId: string,
  tagNames: string[]
): Promise<{ error: string | null }> {
  // 1. Crear/obtener todos los tags necesarios
  const tagResults = await Promise.all(
    tagNames.map((name) => createTag(userId, name))
  )

  const tagIds = tagResults
    .map((r) => r.data?.id)
    .filter((id): id is string => Boolean(id))

  // 2. Borrar todos los entry_tags actuales de esta entry
  const { error: deleteError } = await supabase
    .from('entry_tags')
    .delete()
    .eq('entry_id', entryId)

  if (deleteError) return { error: deleteError.message }

  // 3. Insertar los nuevos
  if (tagIds.length === 0) return { error: null }

  const { error: insertError } = await supabase
    .from('entry_tags')
    .insert(tagIds.map((tag_id) => ({ entry_id: entryId, tag_id })))

  return { error: insertError?.message ?? null }
}
