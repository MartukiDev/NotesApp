'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthHeader } from '@/components/auth/auth-card'
import { PasswordField } from '@/components/auth/password-field'
import { AuthButton } from '@/components/auth/auth-button'
import { StatusMessage } from '@/components/auth/status-message'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  /**
   * Supabase envía el token en el hash fragment (#access_token=...).
   * onAuthStateChange captura el evento PASSWORD_RECOVERY cuando el
   * usuario llega desde el enlace del email.
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsValidSession(true)
        }
      }
    )

    // Verificar si ya hay sesión activa (en caso de recarga)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsValidSession(true)
      else if (isValidSession === null) setIsValidSession(false)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

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

    const { error: authError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (authError) {
      setError('No se pudo actualizar la contraseña. Inténtalo de nuevo.')
      return
    }

    setSuccess(true)
  }

  // Sesión inválida
  if (isValidSession === false) {
    return (
      <AuthCard>
        <AuthHeader
          title="Enlace inválido"
          description="Este enlace de reseteo no es válido o ha expirado"
        />
        <StatusMessage
          type="error"
          message="Solicita un nuevo enlace de reseteo desde la página de login."
          className="mb-6"
        />
        <AuthButton variant="outline" onClick={() => router.push('/forgot-password')}>
          Solicitar nuevo enlace
        </AuthButton>
      </AuthCard>
    )
  }

  // Éxito
  if (success) {
    return (
      <AuthCard>
        <AuthHeader
          title="Contraseña actualizada"
          description="Tu contraseña fue cambiada correctamente"
        />
        <StatusMessage
          type="success"
          message="Ya puedes iniciar sesión con tu nueva contraseña."
          className="mb-6"
        />
        <AuthButton onClick={() => router.push('/login')}>
          Ir al login
        </AuthButton>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Nueva contraseña"
        description="Elige una contraseña segura para tu cuenta"
      />

      {error && <StatusMessage type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label="Nueva contraseña"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }))
          }}
          autoComplete="new-password"
          disabled={loading}
          error={fieldErrors.password}
          showStrength
        />

        <PasswordField
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (fieldErrors.confirmPassword)
              setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }))
          }}
          autoComplete="new-password"
          disabled={loading}
          error={fieldErrors.confirmPassword}
        />

        <AuthButton type="submit" loading={loading}>
          Actualizar contraseña
        </AuthButton>
      </form>
    </AuthCard>
  )
}
