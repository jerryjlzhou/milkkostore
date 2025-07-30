'use client';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { signInDefaultValues } from '@/lib/constants';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className="w-full h-11 text-base font-medium"
        variant="default"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In'
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

      {/* Error Message */}
      {data && !data.success && data.message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 font-medium">{data.message}</p>
        </div>
      )}

      <form action={action} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Email Field */}
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          required
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
        />

        {/* Password Field */}
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          defaultValue={signInDefaultValues.password}
          showPasswordToggle
        />

        {/* Submit Button */}
        <div className="pt-2">
          <SignInButton />
        </div>
      </form>

      {/* Sign Up Link */}
      <div className="text-sm text-center text-muted-foreground border-t pt-6">
        Don&apos;t have an account?{' '}
        <Link
          href={`/sign-up${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
          className="font-semibold text-black hover:underline focus:outline-none focus:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default CredentialsSignInForm;
