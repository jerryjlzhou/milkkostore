import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  showPasswordToggle?: boolean;
  'aria-describedby'?: string;
}

export function FormInput({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  autoComplete,
  defaultValue = '',
  error,
  onChange,
  onBlur,
  className,
  showPasswordToggle = false,
  'aria-describedby': ariaDescribedBy,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const hasError = !!error;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={id}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          hasError && 'text-red-600',
          focused && !hasError && 'text-blue-600'
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onFocus={() => setFocused(true)}
          className={cn(
            'transition-colors duration-200',
            hasError &&
              'border-red-500 focus:border-red-500 focus:ring-red-500',
            !hasError &&
              focused &&
              'border-blue-500 focus:border-blue-500 focus:ring-blue-500',
            showPasswordToggle && 'pr-10'
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : ariaDescribedBy}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
