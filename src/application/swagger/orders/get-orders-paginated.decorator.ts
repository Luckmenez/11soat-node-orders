import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { paginatedOrdersResponseExample } from './examples/order.example';

export function ApiGetOrdersPaginated() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar pedidos paginados',
      description: 'Retorna uma lista paginada de todos os pedidos do sistema',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página (padrão: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Quantidade de itens por página (padrão: 10)',
      example: 10,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de pedidos retornada com sucesso',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            example: paginatedOrdersResponseExample.data,
          },
          meta: {
            type: 'object',
            example: paginatedOrdersResponseExample.meta,
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
      status: HttpStatus.BAD_REQUEST,
      description: 'Parâmetros de paginação inválidos',
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
                example: 'Página deve ser um número positivo',
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
                example: 'Erro ao buscar pedidos',
              },
            },
          },
        },
      },
    }),
  );
}
