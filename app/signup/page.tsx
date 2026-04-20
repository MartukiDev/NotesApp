'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthHeader } from '@/components/auth/auth-card'
import { InputField } from '@/components/auth/input-field'
import { PasswordField } from '@/components/auth/password-field'
import { AuthButton } from '@/components/auth/auth-button'
import { StatusMessage } from '@/components/auth/status-message'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email) {
      errors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Introduce un email válido'
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria'
    } else if (password.length < 8) {
      errors.password = 'Mínimo 8 caracteres'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    router.push('/verify-email')
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Crear cuenta"
        description="Empieza a organizar tus notas"
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
          error={fieldErrors.email}
        />

        <PasswordField
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
          error={fieldErrors.password}
          showStrength
        />

        <PasswordField
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
          error={fieldErrors.confirmPassword}
        />

        <AuthButton type="submit" loading={loading}>
          Crear cuenta
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthCard>
  )
}
