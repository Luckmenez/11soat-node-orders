import { AppError } from '../domain/errors/app.error';

/**
 * Converte um valor para number de forma segura
 * @param value - Valor a ser convertido
 * @param fieldName - Nome do campo (para mensagens de erro)
 * @returns number válido
 * @throws AppError.badRequest se o valor não puder ser convertido
 */
export function toNumber(value: unknown, fieldName: string): number {
  if (typeof value === 'number') {
    if (isNaN(value)) {
      throw AppError.badRequest({
        message: `${fieldName} must be a valid number`,
        details: { [fieldName]: value },
      });
    }
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw AppError.badRequest({
        message: `${fieldName} must be a valid numeric value`,
        details: { [fieldName]: value },
      });
    }
    return parsed;
  }

  throw AppError.badRequest({
    message: `${fieldName} must be a number`,
    details: { [fieldName]: value, type: typeof value },
  });
}

/**
 * Converte um valor para number de forma segura, permitindo null/undefined
 * @param value - Valor a ser convertido
 * @param fieldName - Nome do campo (para mensagens de erro)
 * @returns number válido ou null
 */
export function toNumberOrNull(
  value: unknown,
  fieldName: string,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  return toNumber(value, fieldName);
}

/**
 * Converte um valor para number positivo de forma segura
 * @param value - Valor a ser convertido
 * @param fieldName - Nome do campo (para mensagens de erro)
 * @returns number positivo válido
 * @throws AppError.badRequest se o valor não for positivo
 */
export function toPositiveNumber(value: unknown, fieldName: string): number {
  const num = toNumber(value, fieldName);
  if (num <= 0) {
    throw AppError.badRequest({
      message: `${fieldName} must be greater than zero`,
      details: { [fieldName]: num },
    });
  }
  return num;
}
