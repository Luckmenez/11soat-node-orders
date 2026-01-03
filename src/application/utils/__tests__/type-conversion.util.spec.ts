import { toNumber, toNumberOrNull, toPositiveNumber } from '../type-conversion.util';
import { AppError } from '../../domain/errors/app.error';

describe('Type Conversion Utils', () => {
  describe('toNumber', () => {
    it('should convert valid number to number', () => {
      const result = toNumber(42, 'testField');

      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });

    it('should convert valid string number to number', () => {
      const result = toNumber('123', 'testField');

      expect(result).toBe(123);
      expect(typeof result).toBe('number');
    });

    it('should convert negative number', () => {
      const result = toNumber(-50, 'testField');

      expect(result).toBe(-50);
    });

    it('should convert zero', () => {
      const result = toNumber(0, 'testField');

      expect(result).toBe(0);
    });

    it('should throw error when number is NaN', () => {
      expect(() => toNumber(NaN, 'testField')).toThrow(AppError);
      expect(() => toNumber(NaN, 'testField')).toThrow('testField must be a valid number');
    });

    it('should throw error when string cannot be parsed', () => {
      expect(() => toNumber('abc', 'testField')).toThrow(AppError);
      expect(() => toNumber('abc', 'testField')).toThrow('testField must be a valid numeric value');
    });

    it('should throw error when string is empty', () => {
      expect(() => toNumber('', 'testField')).toThrow(AppError);
    });

    it('should throw error when value is null', () => {
      expect(() => toNumber(null, 'testField')).toThrow(AppError);
      expect(() => toNumber(null, 'testField')).toThrow('testField must be a number');
    });

    it('should throw error when value is undefined', () => {
      expect(() => toNumber(undefined, 'testField')).toThrow(AppError);
      expect(() => toNumber(undefined, 'testField')).toThrow('testField must be a number');
    });

    it('should throw error when value is an object', () => {
      expect(() => toNumber({}, 'testField')).toThrow(AppError);
      expect(() => toNumber({}, 'testField')).toThrow('testField must be a number');
    });

    it('should throw error when value is an array', () => {
      expect(() => toNumber([], 'testField')).toThrow(AppError);
    });

    it('should throw error when value is boolean', () => {
      expect(() => toNumber(true, 'testField')).toThrow(AppError);
    });

    it('should parse string with decimal using parseInt (truncates)', () => {
      const result = toNumber('123.45', 'testField');

      expect(result).toBe(123); // parseInt truncates decimal
    });

    it('should include field name in error message', () => {
      try {
        toNumber('invalid', 'orderId');
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toContain('orderId');
      }
    });
  });

  describe('toNumberOrNull', () => {
    it('should convert valid number to number', () => {
      const result = toNumberOrNull(42, 'testField');

      expect(result).toBe(42);
    });

    it('should convert valid string to number', () => {
      const result = toNumberOrNull('99', 'testField');

      expect(result).toBe(99);
    });

    it('should return null when value is null', () => {
      const result = toNumberOrNull(null, 'testField');

      expect(result).toBeNull();
    });

    it('should return null when value is undefined', () => {
      const result = toNumberOrNull(undefined, 'testField');

      expect(result).toBeNull();
    });

    it('should throw error when value is invalid string', () => {
      expect(() => toNumberOrNull('abc', 'testField')).toThrow(AppError);
    });

    it('should throw error when value is NaN', () => {
      expect(() => toNumberOrNull(NaN, 'testField')).toThrow(AppError);
    });

    it('should throw error when value is object', () => {
      expect(() => toNumberOrNull({}, 'testField')).toThrow(AppError);
    });
  });

  describe('toPositiveNumber', () => {
    it('should convert valid positive number', () => {
      const result = toPositiveNumber(42, 'testField');

      expect(result).toBe(42);
    });

    it('should convert valid positive string number', () => {
      const result = toPositiveNumber('100', 'testField');

      expect(result).toBe(100);
    });

    it('should throw error when number is zero', () => {
      expect(() => toPositiveNumber(0, 'testField')).toThrow(AppError);
      expect(() => toPositiveNumber(0, 'testField')).toThrow('testField must be greater than zero');
    });

    it('should throw error when number is negative', () => {
      expect(() => toPositiveNumber(-1, 'testField')).toThrow(AppError);
      expect(() => toPositiveNumber(-1, 'testField')).toThrow('testField must be greater than zero');
    });

    it('should throw error when string is zero', () => {
      expect(() => toPositiveNumber('0', 'testField')).toThrow(AppError);
    });

    it('should throw error when string is negative', () => {
      expect(() => toPositiveNumber('-50', 'testField')).toThrow(AppError);
    });

    it('should throw error when value is NaN', () => {
      expect(() => toPositiveNumber(NaN, 'testField')).toThrow(AppError);
    });

    it('should throw error when value is invalid string', () => {
      expect(() => toPositiveNumber('abc', 'testField')).toThrow(AppError);
    });

    it('should throw error when value is null', () => {
      expect(() => toPositiveNumber(null, 'testField')).toThrow(AppError);
    });

    it('should throw error when value is undefined', () => {
      expect(() => toPositiveNumber(undefined, 'testField')).toThrow(AppError);
    });

    it('should include field name in error message for non-positive numbers', () => {
      try {
        toPositiveNumber(-5, 'amount');
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toContain('amount');
        expect(error.message).toContain('greater than zero');
      }
    });

    it('should handle decimal numbers correctly (truncates to positive)', () => {
      const result = toPositiveNumber('123.99', 'testField');

      expect(result).toBe(123);
    });

    it('should throw error for decimal that becomes zero or negative after parsing', () => {
      expect(() => toPositiveNumber('0.99', 'testField')).toThrow(AppError);
    });
  });
});
