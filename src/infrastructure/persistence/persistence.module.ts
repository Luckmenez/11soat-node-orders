import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaOrderRepository } from './repositories/order.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'OrderRepositoryPort',
      useClass: PrismaOrderRepository,
    },
  ],
  exports: ['OrderRepositoryPort'],
})
export class PersistenceModule {}
