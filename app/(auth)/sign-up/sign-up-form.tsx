'use client';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { signUpDefaultValues } from '@/lib/constants';
import { signUpUser } from '@/lib/actions/user.actions';
import {
  FormState,
  getFieldError,
  hasFieldError,
  getPasswordStrength,
  validateField,
} from '@/lib/form-utils';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  } as FormState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Client-side validation state
  const [formData, setFormData] = useState({
    name: signUpDefaultValues.name,
    email: signUpDefaultValues.email,
    password: signUpDefaultValues.password,
    confirmPassword: signUpDefaultValues.confirmPassword,
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle field changes
  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear server error when user starts typing
      if (hasFieldError(data, field)) {
        // This will be cleared on next server action
      }

      // Real-time validation
      if (touched[field]) {
        const error = validateField(
          field,
          value,
          field === 'confirmPassword'
            ? formData.password
            : formData.confirmPassword
        );
        setClientErrors((prev) => ({
          ...prev,
          [field]: error || '',
        }));
      }
    },
    [data, formData.password, formData.confirmPassword, touched]
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      const value = formData[field as keyof typeof formData];
      const error = validateField(
        field,
        value,
        field === 'confirmPassword'
          ? formData.password
          : formData.confirmPassword
      );
      setClientErrors((prev) => ({
        ...prev,
        [field]: error || '',
      }));
    },
    [formData]
  );

  // Get display error (server error takes precedence over client error)
  const getDisplayError = (field: string) => {
    return getFieldError(data, field) || clientErrors[field] || '';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    // Check if form has any validation errors
    const hasClientErrors = Object.values(clientErrors).some((error) => error);
    const isDisabled = pending || hasClientErrors;

    return (
      <Button
        disabled={isDisabled}
        className="w-full h-11 text-base font-medium"
        variant="default"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {data?.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">{data.message}</p>
        </div>
      )}

      {/* General Error Message */}
      {data && !data.success && data.message && !data.fieldErrors && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 font-medium">{data.message}</p>
        </div>
      )}

      <form action={action} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Name Field */}
        <FormInput
          id="name"
          name="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          required
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
          error={getDisplayError('name')}
          onChange={(value) => handleFieldChange('name', value)}
          onBlur={() => handleFieldBlur('name')}
        />

        {/* Email Field */}
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          required
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
          error={getDisplayError('email')}
          onChange={(value) => handleFieldChange('email', value)}
          onBlur={() => handleFieldBlur('email')}
        />

        {/* Password Field */}
        <div className="space-y-2">
          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.password}
            error={getDisplayError('password')}
            onChange={(value) => handleFieldChange('password', value)}
            onBlur={() => handleFieldBlur('password')}
            showPasswordToggle
          />

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength:</span>
                <span className={passwordStrength.color}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2
                      ? 'bg-red-500'
                      : passwordStrength.score <= 4
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
          defaultValue={signUpDefaultValues.confirmPassword}
          error={getDisplayError('confirmPassword')}
          onChange={(value) => handleFieldChange('confirmPassword', value)}
          onBlur={() => handleFieldBlur('confirmPassword')}
          showPasswordToggle
        />

        {/* Submit Button */}
        <div className="pt-2">
          <SignUpButton />
        </div>

        {/* General Form Error */}
        {data && !data.success && data.message && data.fieldErrors && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{data.message}</p>
          </div>
        )}
      </form>

      {/* Sign In Link */}
      <div className="text-sm text-center text-muted-foreground border-t pt-6">
        Already have an account?{' '}
        <Link
          href={`/sign-in${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
          className="font-semibold text-black hover:underline focus:outline-none focus:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
