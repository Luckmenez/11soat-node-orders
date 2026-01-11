import { HttpException, HttpStatus } from '../http.exception';

describe('HttpException', () => {
  describe('constructor', () => {
    it('should create exception with HttpExceptionResponse object', () => {
      const response = {
        message: 'Test error',
        statusCode: 400,
        error: 'Bad Request',
        details: { field: 'value' },
      };

      const exception = new HttpException(response, 400);

      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.message).toBe('Test error');
      expect(exception.statusCode).toBe(400);
      expect(exception.response).toEqual(response);
    });

    it('should create exception with string response', () => {
      const message = 'Simple error message';

      const exception = new HttpException(message, 500);

      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.message).toBe(message);
      expect(exception.statusCode).toBe(500);
      expect(exception.response).toEqual({
        statusCode: 500,
        message: message,
      });
    });

    it('should have stack trace captured', () => {
      const exception = new HttpException('Error', 400);

      expect(exception.stack).toBeDefined();
    });

    it('should handle all HTTP status codes', () => {
      expect(new HttpException('Test', HttpStatus.SUCCESS).statusCode).toBe(
        200,
      );
      expect(new HttpException('Test', HttpStatus.CREATED).statusCode).toBe(
        201,
      );
      expect(new HttpException('Test', HttpStatus.ACCEPTED).statusCode).toBe(
        202,
      );
      expect(new HttpException('Test', HttpStatus.NO_CONTENT).statusCode).toBe(
        204,
      );
      expect(
        new HttpException('Test', HttpStatus.NOT_MODIFIED).statusCode,
      ).toBe(304);
      expect(new HttpException('Test', HttpStatus.BAD_REQUEST).statusCode).toBe(
        400,
      );
      expect(
        new HttpException('Test', HttpStatus.UNAUTHORIZED).statusCode,
      ).toBe(401);
      expect(
        new HttpException('Test', HttpStatus.PAYMENT_REQUIRED).statusCode,
      ).toBe(402);
      expect(new HttpException('Test', HttpStatus.FORBIDDEN).statusCode).toBe(
        403,
      );
      expect(new HttpException('Test', HttpStatus.NOT_FOUND).statusCode).toBe(
        404,
      );
      expect(
        new HttpException('Test', HttpStatus.METHOD_NOT_ALLOWED).statusCode,
      ).toBe(405);
      expect(new HttpException('Test', HttpStatus.CONFLICT).statusCode).toBe(
        409,
      );
      expect(
        new HttpException('Test', HttpStatus.INTERNAL_SERVER_ERROR).statusCode,
      ).toBe(500);
      expect(new HttpException('Test', HttpStatus.BAD_GATEWAY).statusCode).toBe(
        502,
      );
      expect(
        new HttpException('Test', HttpStatus.SERVICE_UNAVAILABLE).statusCode,
      ).toBe(503);
      expect(
        new HttpException('Test', HttpStatus.GATEWAY_TIMEOUT).statusCode,
      ).toBe(504);
      expect(
        new HttpException('Test', HttpStatus.HTTP_VERSION_NOT_SUPPORTED)
          .statusCode,
      ).toBe(505);
    });

    it('should handle response object without optional fields', () => {
      const response = {
        message: 'Minimal error',
        statusCode: 400,
      };

      const exception = new HttpException(response, 400);

      expect(exception.response.error).toBeUndefined();
      expect(exception.response.details).toBeUndefined();
    });
  });
});
