import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './Input'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <Input
        ref={ref}
        label={label}
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        rightElement={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-slate-400 hover:text-slate-600"
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        {...props}
      />
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
