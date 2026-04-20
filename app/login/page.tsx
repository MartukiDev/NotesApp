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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Introduce un email válido'
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria'
    } else if (password.length < 6) {
      errors.password = 'Mínimo 6 caracteres'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Bienvenido de vuelta"
        description="Inicia sesión en tu cuenta"
      />

      {error && <StatusMessage type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
          }}
          autoComplete="email"
          disabled={loading}
          error={fieldErrors.email}
        />

        <PasswordField
          label="Contraseña"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }))
          }}
          autoComplete="current-password"
          disabled={loading}
          error={fieldErrors.password}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <AuthButton type="submit" loading={loading}>
          Iniciar sesión
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/signup" className="font-medium text-foreground hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthCard>
  )
}
