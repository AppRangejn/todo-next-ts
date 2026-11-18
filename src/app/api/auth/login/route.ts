import { User } from '@/db/models';
import { signToken } from '@/lib/auth';
import { errorHandler } from '@/lib/errorHandler';
import { validateBody } from '@/lib/validateBody';
import { loginSchema } from '@/validation/authSchemas';
import createError from 'http-errors';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = await validateBody(loginSchema, body);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
