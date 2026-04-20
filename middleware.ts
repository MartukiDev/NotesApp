import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Rutas que requieren sesión activa.
 */
const PROTECTED_ROUTES = ['/']

/**
 * Rutas solo para usuarios NO autenticados.
 */
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Crear response mutable para actualizar cookies de Supabase
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Siempre llamar getUser() — refresca el token si es necesario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = Boolean(user)

  // Ruta protegida + sin sesión → login
  if (PROTECTED_ROUTES.includes(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Ruta de auth + ya autenticado → app
  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica middleware a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico
     * - archivos de public/
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
