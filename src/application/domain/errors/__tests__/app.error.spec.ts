import { AppError } from '../app.error';
import { HttpStatus } from '../http.exception';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create error with all parameters', () => {
      const error = new AppError({
        message: 'Test error',
        statusCode: 500,
        errorType: 'TestError',
        details: { field: 'value' },
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.errorType).toBe('TestError');
      expect(error.details).toEqual({ field: 'value' });
    });

    it('should use default status code (500) when not provided', () => {
      const error = new AppError({
        message: 'Test error',
      });

      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should use default error type when not provided', () => {
      const error = new AppError({
        message: 'Test error',
      });

      expect(error.errorType).toBe('ApplicationError');
    });

    it('should allow undefined details', () => {
      const error = new AppError({
        message: 'Test error',
      });

      expect(error.details).toBeUndefined();
    });
  });

  describe('notFound', () => {
    it('should create 404 error', () => {
      const error = AppError.notFound({
        message: 'Resource not found',
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.statusCode).toBe(404);
    });

    it('should set error type to NotFoundError', () => {
      const error = AppError.notFound({
        message: 'Resource not found',
      });

      expect(error.errorType).toBe('NotFoundError');
    });

    it('should preserve message', () => {
      const error = AppError.notFound({
        message: 'Order not found.',
      });

      expect(error.message).toBe('Order not found.');
    });

    it('should preserve details', () => {
      const error = AppError.notFound({
        message: 'Order not found.',
        details: { orderId: 123 },
      });

      expect(error.details).toEqual({ orderId: 123 });
    });
  });

  describe('badRequest', () => {
    it('should create 400 error', () => {
      const error = AppError.badRequest({
        message: 'Invalid input',
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.statusCode).toBe(400);
    });

    it('should set error type to BadRequestError', () => {
      const error = AppError.badRequest({
        message: 'Invalid input',
      });

      expect(error.errorType).toBe('BadRequestError');
    });

    it('should preserve message and details', () => {
      const error = AppError.badRequest({
        message: 'Validation failed',
        details: { field: 'email', error: 'invalid format' },
      });

      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual({
        field: 'email',
        error: 'invalid format',
      });
    });
  });

  describe('unauthorized', () => {
    it('should create 401 error', () => {
      const error = AppError.unauthorized({
        message: 'Authentication required',
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.statusCode).toBe(401);
    });

    it('should set error type to UnauthorizedError', () => {
      const error = AppError.unauthorized({
        message: 'Authentication required',
      });

      expect(error.errorType).toBe('UnauthorizedError');
    });

    it('should preserve message', () => {
      const error = AppError.unauthorized({
        message: 'Invalid token',
      });

      expect(error.message).toBe('Invalid token');
    });
  });

  describe('forbidden', () => {
    it('should create 403 error', () => {
      const error = AppError.forbidden({
        message: 'Access denied',
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(error.statusCode).toBe(403);
    });

    it('should set error type to ForbiddenError', () => {
      const error = AppError.forbidden({
        message: 'Access denied',
      });

      expect(error.errorType).toBe('ForbiddenError');
    });

    it('should preserve message and details', () => {
      const error = AppError.forbidden({
        message: 'Insufficient permissions',
        details: { requiredRole: 'admin' },
      });

      expect(error.message).toBe('Insufficient permissions');
      expect(error.details).toEqual({ requiredRole: 'admin' });
    });
  });

  describe('conflict', () => {
    it('should create 409 error', () => {
      const error = AppError.conflict({
        message: 'Resource already exists',
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.statusCode).toBe(409);
    });

    it('should set error type to ConflictError', () => {
      const error = AppError.conflict({
        message: 'Resource already exists',
      });

      expect(error.errorType).toBe('ConflictError');
    });

    it('should preserve message', () => {
      const error = AppError.conflict({
        message: 'Email already in use',
      });

      expect(error.message).toBe('Email already in use');
    });
  });

  describe('internal', () => {
    it('should create 500 error', () => {
      const error = AppError.internal({
        message: 'Internal server error',
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.statusCode).toBe(500);
    });

    it('should set error type to InternalServerError', () => {
      const error = AppError.internal({
        message: 'Internal server error',
      });

      expect(error.errorType).toBe('InternalServerError');
    });

    it('should preserve message and details', () => {
      const error = AppError.internal({
        message: 'Database connection failed',
        details: { host: 'localhost', port: 5432 },
      });

      expect(error.message).toBe('Database connection failed');
      expect(error.details).toEqual({ host: 'localhost', port: 5432 });
    });
  });
});
