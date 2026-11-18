import createError from 'http-errors';
import { Schema, ValidationError } from 'yup';

export async function validateBody<T>(
  schema: Schema<T>,
  data: unknown,
): Promise<T> {
  try {
    return await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw createError(400, err.errors.join(', '));
    }
    throw err;
  }
}
