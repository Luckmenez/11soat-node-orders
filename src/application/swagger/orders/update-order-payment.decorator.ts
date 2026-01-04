import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  updateOrderPaymentExample,
  updateOrderPaymentFailedExample,
  orderResponseExample,
} from './examples/order.example';

export function ApiUpdateOrderPayment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar status de pagamento do pedido',
      description:
        'Atualiza o status de pagamento de um pedido existente (PAID, FAILED, etc)',
    }),
    ApiBody({
      description: 'Dados de atualização do pagamento',
      examples: {
        paid: {
          summary: 'Pagamento Aprovado',
          value: updateOrderPaymentExample,
        },
        failed: {
          summary: 'Pagamento Recusado',
          value: updateOrderPaymentFailedExample,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Status de pagamento atualizado com sucesso',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            example: {
              ...orderResponseExample,
              status: 'PAID',
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
                example: 'Status de pagamento inválido',
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
                example: 'Erro ao atualizar status de pagamento',
              },
            },
          },
        },
      },
    }),
  );
}
