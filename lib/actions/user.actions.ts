'use server';

import { signInFormSchema, signUpFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { ZodError } from 'zod';

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

    await signIn('credentials', user);

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

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
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
