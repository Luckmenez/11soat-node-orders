# Camada de Persistência - Arquitetura Hexagonal

Esta camada implementa a **persistência de dados** seguindo os princípios da **Arquitetura Hexagonal**.

## Estrutura

```
persistence/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados (Prisma ORM)
├── mappers/
│   └── order.mapper.ts        # Conversão: Prisma Models ↔ Domain Entities
├── repositories/
│   └── prisma-order.repository.ts  # Implementação da porta OrderRepositoryPort
├── prisma.service.ts          # Serviço Prisma (Singleton)
└── persistence.module.ts      # Módulo NestJS
```

## Princípios Aplicados

### 1. Inversão de Dependência

A **porta** (`OrderRepositoryPort`) está definida no **domínio/aplicação**:
```
src/application/ports/output/order.repository.port.ts
```

A **implementação** (`PrismaOrderRepository`) está na **infraestrutura**:
```
src/infrastructure/persistence/repositories/prisma-order.repository.ts
```

**Fluxo de Dependência:**
```
Use Case → OrderRepositoryPort ← PrismaOrderRepository
(Application)  (Interface)       (Infrastructure)
```

### 2. Mappers (Anti-Corruption Layer)

O `OrderMapper` converte entre:
- **Prisma Models** (detalhes de infraestrutura)
- **Domain Entities** (conceitos de negócio)

Isso garante que:
- O domínio nunca conhece o Prisma
- Mudanças no banco não afetam o domínio
- Entidades de domínio são puras (sem anotações ORM)

### 3. Separação de Responsabilidades

- **Schema Prisma**: Define estrutura do banco (tabelas, relações, índices)
- **Mapper**: Traduz entre camadas
- **Repository**: Implementa operações de persistência

## Como Usar

### 1. Configurar Banco de Dados

#### Opção A: Prisma Dev (Recomendado para desenvolvimento)
```bash
npx prisma dev
```

#### Opção B: PostgreSQL Local/Docker
```bash
# Docker
docker run --name postgres-orders \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=orders_db \
  -p 5432:5432 \
  -d postgres:16-alpine

# Configurar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orders_db?schema=public"
```

### 2. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 3. Executar Migrations

```bash
npm run prisma:migrate
```

### 4. Visualizar Banco (Prisma Studio)

```bash
npm run prisma:studio
```

## Scripts NPM Sugeridos

Adicione ao `package.json`:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate --schema=./src/infrastructure/persistence/prisma/schema.prisma",
    "prisma:migrate": "prisma migrate dev --schema=./src/infrastructure/persistence/prisma/schema.prisma",
    "prisma:studio": "prisma studio --schema=./src/infrastructure/persistence/prisma/schema.prisma",
    "prisma:deploy": "prisma migrate deploy --schema=./src/infrastructure/persistence/prisma/schema.prisma"
  }
}
```

## Exemplo de Uso no Use Case

```typescript
@Injectable()
export class CreateOrderUseCase implements CreateOrderUseCasePort {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort, // Interface
  ) {}

  async execute(data: CreateOrderDto): Promise<OrderEntity> {
    const order = OrderEntity.create({
      items: data.items.map(item => OrderItemEntity.create(item)),
      clientId: data.clientId,
    });

    // Salva usando a porta (não sabe que é Prisma!)
    const savedOrder = await this.orderRepository.save(order);

    return savedOrder;
  }
}
```

## Vantagens da Abordagem

1. **Testabilidade**: Use Cases podem ser testados com mocks da porta
2. **Flexibilidade**: Trocar Prisma por TypeORM não afeta o domínio
3. **Pureza do Domínio**: Entidades sem anotações de frameworks
4. **Manutenibilidade**: Mudanças isoladas por camada
