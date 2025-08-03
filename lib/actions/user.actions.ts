'use server';

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { ZodError } from 'zod';
import { ShippingAddress } from '@/types';
import { formatError } from '../utils';

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const callbackUrl = formData.get('callbackUrl') as string;

    await signIn('credentials', {
      ...user,
      callbackUrl: callbackUrl || '/',
    });

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign out
export async function signOutUser() {
  const session = await auth();

  // Delete the current user's cart when they sign out
  if (session?.user?.id) {
    await prisma.cart.deleteMany({
      where: { userId: session.user.id },
    });
  }

  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists',
        fieldErrors: {
          email: ['An account with this email already exists'],
        },
      };
    }

    const plainPassword = user.password;
    const hashedPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    const callbackUrl = formData.get('callbackUrl') as string;

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
      callbackUrl: callbackUrl || '/',
    });

    return {
      success: true,
      message: 'Account created successfully! Welcome to MilkkoStore.',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      });

      return {
        success: false,
        message: 'Please check the errors below',
        fieldErrors,
      };
    }

    // Handle database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          message: 'An account with this email already exists',
          fieldErrors: {
            email: ['An account with this email already exists'],
          },
        };
      }
    }

    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User address updated successfully!',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
