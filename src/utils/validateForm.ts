import { Schema, ValidationError } from 'yup';

export type FormValidationResult<T> =
  | { data: T; errors: null }
  | { data: null; errors: Record<string, string> };

export async function validateForm<T>(
  schema: Schema<T>,
  values: unknown,
): Promise<FormValidationResult<T>> {
  try {
    const data = await schema.validate(values, {
      abortEarly: false,
      stripUnknown: true,
    });
    return { data, errors: null };
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((issue) => {
        if (issue.path && !errors[issue.path]) {
          errors[issue.path] = issue.message;
        }
      });
      return { data: null, errors };
    }
    throw err;
  }
}
