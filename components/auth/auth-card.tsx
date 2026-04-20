'use client'

import { cn } from '@/lib/utils'

interface AuthCardProps {
  children: React.ReactNode
  className?: string
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div
        className={cn(
          'w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface AuthHeaderProps {
  title: string
  description?: string
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
