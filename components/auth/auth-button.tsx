'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  children: React.ReactNode
}

export function AuthButton({ 
  loading = false, 
  variant = 'default',
  children, 
  className,
  disabled,
  ...props 
}: AuthButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn('w-full', className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </Button>
  )
}
