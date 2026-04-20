'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusMessageProps {
  type: 'error' | 'success'
  message: string
  className?: string
}

export function StatusMessage({ type, message, className }: StatusMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md p-3 text-sm',
        type === 'error' && 'bg-destructive/10 text-destructive',
        type === 'success' && 'bg-green-500/10 text-green-600 dark:text-green-400',
        className
      )}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {type === 'error' ? (
        <AlertCircle className="h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}
