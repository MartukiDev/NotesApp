'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  showStrength?: boolean
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-destructive' }
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' }
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' }
  if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-green-500' }
  return { score: 5, label: 'Very Strong', color: 'bg-green-600' }
}

export function PasswordField({ 
  label, 
  error, 
  showStrength = false,
  className, 
  id,
  value,
  ...props 
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  const strength = showStrength && typeof value === 'string' && value.length > 0 
    ? getPasswordStrength(value) 
    : null

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', error && 'border-destructive', className)}
          aria-invalid={!!error}
          value={value}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {strength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  level <= strength.score ? strength.color : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{strength.label}</p>
        </div>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
