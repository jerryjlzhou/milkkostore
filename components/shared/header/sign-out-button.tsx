'use client';

import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

const SignOutButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutUser();
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isPending}
      className="w-full py-4 px-2 h-4 justify-start"
      variant="ghost"
    >
      {isPending ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
};

export default SignOutButton;
