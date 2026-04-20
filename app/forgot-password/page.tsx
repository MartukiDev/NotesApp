'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthHeader } from '@/components/auth/auth-card'
import { InputField } from '@/components/auth/input-field'
import { AuthButton } from '@/components/auth/auth-button'
import { StatusMessage } from '@/components/auth/status-message'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Introduce tu email')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Introduce un email válido')
      return
    }

    setLoading(true)

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (authError) {
      setError('No se pudo enviar el email. Inténtalo de nuevo.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard>
        <AuthHeader
          title="Revisa tu email"
          description="Te enviamos las instrucciones para restablecer tu contraseña"
        />

        <StatusMessage
          type="success"
          message={`Enlace enviado a ${email}`}
          className="mb-4"
        />

        <p className="text-sm text-muted-foreground text-center mb-6">
          ¿No lo recibiste? Revisa la carpeta de spam o inténtalo de nuevo.
        </p>

        <AuthButton
          variant="outline"
          onClick={() => {
            setSent(false)
            setEmail('')
          }}
        >
          Intentar con otro email
        </AuthButton>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al login
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <AuthHeader
        title="¿Olvidaste tu contraseña?"
        description="Introduce tu email y te enviaremos un enlace de recuperación"
      />

      {error && <StatusMessage type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
        />

        <AuthButton type="submit" loading={loading}>
          Enviar enlace de recuperación
        </AuthButton>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al login
      </Link>
    </AuthCard>
  )
}
