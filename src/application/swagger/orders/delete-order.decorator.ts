import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export function ApiDeleteOrder() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deletar pedido',
      description: 'Remove um pedido do sistema pelo ID',
    }),
    ApiParam({
      name: 'orderId',
      description: 'ID do pedido a ser deletado',
      type: String,
      example: '1',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Pedido deletado com sucesso',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              orderId: {
                type: 'string',
                example: '1',
              },
              message: {
                type: 'string',
                example: 'Pedido deletado com sucesso',
              },
            },
          },
          metadata: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                example: '2024-01-15T10:30:00Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Pedido não encontrado',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'ORDER_NOT_FOUND' },
              message: {
                type: 'string',
                example: 'Pedido com ID 1 não encontrado',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'ID do pedido inválido',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: {
                type: 'string',
                example: 'ID do pedido deve ser um número válido',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno do servidor',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'INTERNAL_ERROR' },
              message: {
                type: 'string',
                example: 'Erro ao deletar pedido',
              },
            },
          },
        },
      },
    }),
  );
}
