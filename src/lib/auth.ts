import { JwtPayload } from '@/types';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError(500, 'JWT_SECRET is not configured');
  }
  return secret;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function getAuthUser(req: NextRequest): JwtPayload {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError(401, 'Authorization token is required');
  }

  const token = authHeader.split(' ')[1];
  const secret = getJwtSecret();

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw createError(401, 'Invalid or expired token');
  }
}
