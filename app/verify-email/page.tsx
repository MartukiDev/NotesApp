'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, CheckCircle2 } from 'lucide-react'
import { AuthCard, AuthHeader } from '@/components/auth/auth-card'
import { AuthButton } from '@/components/auth/auth-button'
import { StatusMessage } from '@/components/auth/status-message'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    /**
     * TODO: reemplazar con listener real de Supabase:
     *
     * const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
     *   if (event === 'SIGNED_IN') {
     *     router.push('/onboarding')
     *   }
     * })
     * return () => subscription.unsubscribe()
     *
     * La estructura de cleanup ya está lista abajo.
     */
    let cancelled = false

    // Simulación: verifica automáticamente después de 8s (para demo)
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setVerified(true)
        setTimeout(() => {
          if (!cancelled) router.push('/onboarding')
        }, 2000)
      }
    }, 8000)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [router])

  const handleResend = async () => {
    setResending(true)
    setResent(false)

    // TODO: reemplazar con supabase.auth.resend({ type: 'signup', email })
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setResending(false)
    setResent(true)
  }

  if (verified) {
    return (
      <AuthCard>
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <AuthHeader
          title="¡Email verificado!"
          description="Tu cuenta fue confirmada. Redirigiendo..."
        />
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <div className="flex justify-center mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      </div>

      <AuthHeader
        title="Verifica tu email"
        description="Enviamos un enlace de verificación a tu dirección de email"
      />

      {resent && (
        <StatusMessage
          type="success"
          message="Email de verificación reenviado"
          className="mb-4"
        />
      )}

      <div className="space-y-3 text-center text-sm text-muted-foreground mb-6">
        <p>Haz clic en el enlace del email para verificar tu cuenta y continuar.</p>
        <p>Si no lo ves, revisa tu carpeta de spam.</p>
      </div>

      <AuthButton
        variant="outline"
        loading={resending}
        onClick={handleResend}
      >
        Reenviar email
      </AuthButton>
    </AuthCard>
  )
}
