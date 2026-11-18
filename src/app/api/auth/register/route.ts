import { User } from '@/db/models';
import { errorHandler } from '@/lib/errorHandler';
import { validateBody } from '@/lib/validateBody';
import { registerSchema } from '@/validation/authSchemas';
import createError from 'http-errors';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { full_name, email, password } = await validateBody(
      registerSchema,
      body,
    );

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(409, 'User with this email already exists');
    }

    const newUser = await User.create({
      full_name,
      email,
      password,
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
