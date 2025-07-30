/**
 * Utility functions for form handling and validation
 */

export type FormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Get field-level error message for display
 */
export function getFieldError(
  state: FormState | null,
  fieldName: string
): string | undefined {
  if (!state || !state.fieldErrors) return undefined;

  const errors = state.fieldErrors[fieldName];
  return errors && errors.length > 0 ? errors[0] : undefined;
}

/**
 * Check if a field has errors
 */
export function hasFieldError(
  state: FormState | null,
  fieldName: string
): boolean {
  return !!getFieldError(state, fieldName);
}

/**
 * Get all errors for a field
 */
export function getFieldErrors(
  state: FormState | null,
  fieldName: string
): string[] {
  if (!state || !state.fieldErrors) return [];

  return state.fieldErrors[fieldName] || [];
}

/**
 * Check if the form has any errors
 */
export function hasErrors(state: FormState | null): boolean {
  if (!state) return false;

  return (
    !state.success &&
    (!!state.message ||
      (!!state.fieldErrors && Object.keys(state.fieldErrors).length > 0))
  );
}

/**
 * Password strength checker
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { score, label: 'Weak', color: 'text-red-500' };
  } else if (score <= 3) {
    return { score, label: 'Medium', color: 'text-yellow-500' };
  } else {
    return { score, label: 'Strong', color: 'text-green-500' };
  }
}

/**
 * Real-time validation for client-side feedback
 */
export function validateField(
  name: string,
  value: string,
  confirmPassword?: string
): string | null {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      if (value.length > 50) return 'Name must be less than 50 characters';
      if (!/^[a-zA-Z\s]+$/.test(value))
        return 'Name can only contain letters and spaces';
      return null;

    case 'email':
      if (!value.trim()) return 'Email is required';
      if (value.length > 100) return 'Email must be less than 100 characters';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'Please enter a valid email address';
      return null;

    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (value.length > 100)
        return 'Password must be less than 100 characters';
      if (!/[a-z]/.test(value))
        return 'Password must contain at least one lowercase letter';
      if (!/[A-Z]/.test(value))
        return 'Password must contain at least one uppercase letter';
      if (!/[0-9]/.test(value))
        return 'Password must contain at least one number';
      return null;

    case 'confirmPassword':
      if (!value) return 'Please confirm your password';
      if (confirmPassword && value !== confirmPassword)
        return "Passwords don't match";
      return null;

    default:
      return null;
  }
}
