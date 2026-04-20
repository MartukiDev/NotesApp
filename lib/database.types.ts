// ─────────────────────────────────────────────
// Tipos de base de datos (Supabase — snake_case)
// ─────────────────────────────────────────────

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      notebooks: {
        Row: {
          id: string
          user_id: string
          name: string
          is_journal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          is_journal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_journal?: boolean
          created_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          user_id: string
          notebook_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notebook_id: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notebook_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
        }
      }
      entry_tags: {
        Row: {
          entry_id: string
          tag_id: string
        }
        Insert: {
          entry_id: string
          tag_id: string
        }
        Update: {
          entry_id?: string
          tag_id?: string
        }
      }
    }
  }
}
