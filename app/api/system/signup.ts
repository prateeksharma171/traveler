'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

type SignUpValues = {
  name: string;
  email: string;
  password: string;
};

type SignUpResponse = {
  error?: string;
  message?: string;
  userId?: string;
  status: number;
};

export const signUp = async (values: SignUpValues): Promise<SignUpResponse> => {
  try {
    const { name, email, password } = values;

    if (!name || !email || !password) {
      return { error: 'Missing fields', status: 400 };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'User already exists', status: 409 };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
      userId: newUser.id,
      status: 201,
    };
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return { error: 'Internal Server Error', status: 500 };
  }
};
