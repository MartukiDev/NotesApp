'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function InputField({ label, error, className, id, ...props }: InputFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <Input
        id={inputId}
        className={cn(error && 'border-destructive', className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
