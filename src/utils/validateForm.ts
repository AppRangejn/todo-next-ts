import * as Yup from 'yup';

export type FormFieldErrors<T> = Partial<Record<keyof T, string>>;

export type ValidationResult<T> =
  | { isValid: true; data: T; errors: FormFieldErrors<T> }
  | { isValid: false; data: null; errors: FormFieldErrors<T> };

export async function validateForm<T extends Record<string, unknown>>(
  schema: Yup.ObjectSchema<Yup.AnyObject>,
  values: T,
): Promise<ValidationResult<T>> {
  try {
    const validData = (await schema.validate(values, {
      abortEarly: false,
    })) as T;

    return {
      isValid: true,
      data: validData,
      errors: {},
    };
  } catch (err) {
    const errors: FormFieldErrors<T> = {};

    if (err instanceof Yup.ValidationError) {
      err.inner.forEach((issue) => {
        if (issue.path && !errors[issue.path as keyof T]) {
          errors[issue.path as keyof T] = issue.message;
        }
      });
    }

    return {
      isValid: false,
      data: null,
      errors,
    };
  }
}
