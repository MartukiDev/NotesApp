import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * Route handler para el enlace de confirmación de email.
 * Supabase redirige aquí con un `code` cuando el usuario
 * hace clic en el email de verificación.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
