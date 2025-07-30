import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { CardTitle } from '@/components/ui/card';
import CredentialsSignInForm from './credentials-signin-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  // If user logs in and starts session, redirect to home page
  if (session) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-6 pb-8">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME}`}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Sign in to your account to continue shopping
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
