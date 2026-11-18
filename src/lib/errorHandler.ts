import { isHttpError } from 'http-errors';
import { NextResponse } from 'next/server';
import { UniqueConstraintError } from 'sequelize';
import { ValidationError } from 'yup';

export function errorHandler(error: unknown): NextResponse {
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { message: 'Invalid JSON payload' },
      { status: 400 },
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { message: 'Validation error', errors: error.errors },
      { status: 400 },
    );
  }

  if (error instanceof UniqueConstraintError) {
    return NextResponse.json(
      { message: 'Record with this value already exists' },
      { status: 409 },
    );
  }

  if (isHttpError(error)) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  }

  console.error('Unhandled API error:', error);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error instanceof Error
        ? error.message
        : 'Internal server error';

  return NextResponse.json({ message }, { status: 500 });
}
