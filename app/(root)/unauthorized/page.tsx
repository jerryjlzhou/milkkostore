import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unauthorized Access',
};

const UnauthorizedPage = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Unauthorized Access
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page or resource.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
