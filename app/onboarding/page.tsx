'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, BookOpen, Check, Tags, Save, Layout } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { createNotebook } from '@/lib/api/notebooks'
import { AuthCard } from '@/components/auth/auth-card'
import { InputField } from '@/components/auth/input-field'
import { AuthButton } from '@/components/auth/auth-button'
import { StatusMessage } from '@/components/auth/status-message'

type OnboardingStep = 1 | 2 | 3 | 4

interface StepIndicatorProps {
  currentStep: OnboardingStep
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-2 w-2 rounded-full transition-colors ${
            step === currentStep
              ? 'bg-primary'
              : step < currentStep
              ? 'bg-primary/50'
              : 'bg-muted'
          }`}
        />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>(1)
  const [name, setName] = useState('')
  const [notebookName, setNotebookName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = async () => {
    if (step === 1 && !name.trim()) return
    if (step === 3 && !notebookName.trim()) return

    if (step < 4) {
      setStep((step + 1) as OnboardingStep)
    } else {
      setLoading(true)
      setError('')

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No autenticado')

        // 1. Guardar nombre en los metadatos del usuario
        await supabase.auth.updateUser({
          data: {
            full_name: name,
            onboarding_completed: true,
          },
        })

        // 2. Crear el Journal por defecto (siempre)
        await createNotebook(user.id, 'Journal', true)

        // 3. Crear el primer notebook personalizado (si no es "Journal")
        const customName = notebookName.trim()
        if (customName && customName.toLowerCase() !== 'journal') {
          await createNotebook(user.id, customName)
        }

        router.push('/')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Algo salió mal')
        setLoading(false)
      }
    }
  }

  const handleSkip = () => {
    if (step === 3) {
      setNotebookName('Mis notas')
    }
    setStep((step + 1) as OnboardingStep)
  }

  return (
    <AuthCard>
      <StepIndicator currentStep={step} totalSteps={4} />

      {error && <StatusMessage type="error" message={error} className="mb-4" />}

      {step === 1 && (
        <>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Bienvenido a Notes
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Vamos a configurar tu espacio. ¿Cómo te llamamos?
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              label="Tu nombre"
              placeholder="Introduce tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            <AuthButton onClick={handleNext} disabled={!name.trim()}>
              Continuar
            </AuthButton>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Layout className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Descubre tus herramientas
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Todo lo que necesitas para organizar tu mente de forma simple.
            </p>
          </div>

          <div className="space-y-4 mb-6 text-left">
             <div className="flex items-start gap-3">
               <div className="bg-primary/10 p-2 rounded-md shrink-0"><BookOpen className="w-4 h-4 text-primary" /></div>
               <div className="min-w-0">
                  <h3 className="text-sm font-medium">Notebooks y Journals</h3>
                  <p className="text-xs text-muted-foreground">Agrupa tus notas libremente, o usa el modo Journal para un orden cronológico automático.</p>
               </div>
             </div>
             <div className="flex items-start gap-3">
               <div className="bg-primary/10 p-2 rounded-md shrink-0"><Tags className="w-4 h-4 text-primary" /></div>
               <div className="min-w-0">
                  <h3 className="text-sm font-medium">Etiquetas y Filtros</h3>
                  <p className="text-xs text-muted-foreground">Organiza sin esfuerzo añadiendo etiquetas a tus entradas con búsqueda instantánea.</p>
               </div>
             </div>
             <div className="flex items-start gap-3">
               <div className="bg-primary/10 p-2 rounded-md shrink-0"><Save className="w-4 h-4 text-primary" /></div>
               <div className="min-w-0">
                  <h3 className="text-sm font-medium">Auto-guardado Mágico</h3>
                  <p className="text-xs text-muted-foreground">No hay botón de guardar. Escribe tranquilamente y todo se sincronizará al instante en todos tus dispositivos.</p>
               </div>
             </div>
          </div>

          <AuthButton onClick={handleNext}>
            Siguiente
          </AuthButton>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Crea tu primer notebook
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Los notebooks te ayudan a organizar tus notas por tema
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              label="Nombre del notebook"
              placeholder="Ej: Trabajo, Ideas, Universidad"
              value={notebookName}
              onChange={(e) => setNotebookName(e.target.value)}
              autoFocus
            />

            <AuthButton onClick={handleNext} disabled={!notebookName.trim()}>
              Crear notebook
            </AuthButton>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Omitir por ahora
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-6 w-6 text-green-500" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              ¡Todo listo!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {name ? `¡Bienvenido, ${name}!` : '¡Bienvenido!'} Tu workspace está listo.
              Empieza a capturar tus ideas.
            </p>
          </div>

          <AuthButton onClick={handleNext} loading={loading}>
            Ir a la app
          </AuthButton>
        </>
      )}
    </AuthCard>
  )
}
