'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CredentialsSignInForm = () => {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="password"
          defaultValue={signInDefaultValues.password}
        />
      </div>
      <div>
        <Button className="w-full" variant="default">
          Sign in
        </Button>
      </div>
      <div className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" target="_self" className="link font-semibold">
          Sign Up
        </Link>
      </div>
    </form>
  );
};
export default CredentialsSignInForm;
