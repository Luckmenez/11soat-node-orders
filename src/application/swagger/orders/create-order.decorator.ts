import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import {
  createOrderExample,
  createOrderRandomClientExample,
  orderResponseExample,
} from './examples/order.example';

export function ApiCreateOrder() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar novo pedido',
      description: 'Cria um novo pedido no sistema com itens e informações do cliente',
    }),
    ApiHeader({
      name: 'Authorization',
      description: 'Token JWT de autenticação',
      required: true,
      schema: {
        type: 'string',
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    }),
    ApiBody({
      description: 'Dados do pedido a ser criado',
      examples: {
        registeredClient: {
          summary: 'Pedido de Cliente Cadastrado',
          value: createOrderExample,
        },
        randomClient: {
          summary: 'Pedido de Cliente Anônimo',
          value: createOrderRandomClientExample,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Pedido criado com sucesso',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            example: orderResponseExample,
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
      description: 'Dados inválidos',
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
                example: 'Items do pedido são obrigatórios',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Token de autenticação inválido ou ausente',
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
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Token inválido ou expirado' },
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
                example: 'Erro ao processar pedido',
              },
            },
          },
        },
      },
    }),
  );
}
