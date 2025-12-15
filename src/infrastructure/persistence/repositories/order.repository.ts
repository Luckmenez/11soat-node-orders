import { Injectable } from '@nestjs/common';
import { OrderRepositoryPort } from 'src/application/ports/output/order.repository.port';
import { OrderEntity } from 'src/application/domain/entities/orders.entity';
import { OrderStatus } from 'src/application/value-objects/order-status.enum';
import { PrismaService } from '../prisma.service';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(order: OrderEntity): Promise<OrderEntity> {
    const data = OrderMapper.toCreateInput(order);

    const savedOrder = await this.prisma.order.create({
      data,
      include: {
        items: {
          include: {
            customerItems: true,
          },
        },
      },
    });

    return OrderMapper.toEntity(savedOrder);
  }

  async findById(id: number): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            customerItems: true,
          },
        },
      },
    });

    return order ? OrderMapper.toEntity(order) : null;
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findFirst({
      where: { transactionId },
      include: {
        items: {
          include: {
            customerItems: true,
          },
        },
      },
    });

    return order ? OrderMapper.toEntity(order) : null;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
