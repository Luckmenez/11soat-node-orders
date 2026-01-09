# 🍔 Orders Service - Microserviço de Pedidos
[![Code Coverage](https://img.shields.io/badge/coverage-97.16%25-brightgreen)](https://sonarcloud.io/summary/new_code?id=Luckmenez_11soat-node-orders)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Luckmenez_11soat-node-orders&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Luckmenez_11soat-node-orders)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Luckmenez_11soat-node-orders&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Luckmenez_11soat-node-orders)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748.svg)](https://www.prisma.io/)


*Collections para testes*: [Collection payment]([https://drive.google.com/file/d/12WmL1zfXAoUVktYUGq4pYm_CDR5q-NO4/view?usp=sharing](https://drive.google.com/file/d/1RL_J-YeaSC5ci32U3C8mxzTXFOc6_54R/view?usp=sharing))

## 📋 Descrição

Microserviço de gerenciamento de pedidos desenvolvido com NestJS, responsável por processar pedidos de clientes em um sistema de fast-food. Faz parte de uma arquitetura de microserviços que inclui serviços de autenticação, produtos e pagamentos.

### 🎯 Funcionalidades

- ✅ Criação de pedidos com múltiplos itens
- ✅ Customização de produtos (ingredientes adicionais/removidos)
- ✅ Integração com gateway de pagamentos
- ✅ Gerenciamento de status do pedido (7 estados)
- ✅ Paginação de pedidos
- ✅ Atualização de status de pagamento
- ✅ Suporte a clientes identificados e anônimos
- ✅ Validação de autenticação JWT
- ✅ Arquitetura Limpa (Clean Architecture)
- ✅ Testes BDD com Cucumber
- ✅ Cobertura de testes acima de 80%

---

## 📊 Evidências de Cobertura de Testes

### Microserviço Orders Service

**Cobertura Global: 97.16%** 🎯

| Métrica        | Resultado | Threshold | Status |
| -------------- | --------- | --------- | ------ |
| **Statements** | 97.16%    | 80%       | ✅     |
| **Branches**   | 81.52%    | 80%       | ✅     |
| **Functions**  | 92.00%    | 80%       | ✅     |
| **Lines**      | 96.94%    | 80%       | ✅     |

#### Detalhamento por Módulo:

| Módulo                   | Statements | Branches | Functions | Lines  | Status |
| ------------------------ | ---------- | -------- | --------- | ------ | ------ |
| **Controllers**          | 100%       | 100%     | 100%      | 100%   | ✅     |
| **Use Cases**            | 100%       | 66.66%   | 100%      | 100%   | ✅     |
| **Entities (Domain)**    | 98.24%     | 86.11%   | 94.73%    | 98.18% | ✅     |
| **Repositories**         | 100%       | 100%     | 100%      | 100%   | ✅     |
| **Presenters**           | 100%       | 66.66%   | 100%      | 100%   | ✅     |
| **Utilities**            | 100%       | 100%     | 100%      | 100%   | ✅     |
| **Swagger Decorators**   | 100%       | 100%     | 100%      | 100%   | ✅     |
| **Gateway - Auth**       | 100%       | 100%     | 100%      | 100%   | ✅     |
| **Gateway - Products**   | 100%       | 100%     | 100%      | 100%   | ✅     |
| **Gateway - Payment**    | 81.25%     | 0%       | 50%       | 78.57% | ⚠️     |
| **Error Handlers**       | 97.22%     | 75%      | 100%      | 97.22% | ✅     |
| **Mappers**              | 66.66%     | 100%     | 57.14%    | 66.66% | ⚠️     |

**Observações:**
- ✅ **Cobertura excepcional**: 97.16% de statements superando o threshold de 80%
- ✅ **188 testes passando** de 210 testes totais (89.5% de sucesso)
- ⚠️ **Payment Gateway** e **Mappers** são áreas identificadas para melhoria
- 📈 **Componentes críticos** (Controllers, Use Cases, Repositories) com 100% de cobertura

### 📸 Evidência Visual

Para visualizar o relatório completo de cobertura, execute:

```bash
npm run test:cov
```

O relatório HTML estará disponível em: `coverage/lcov-report/index.html`

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── application/              # Camada de aplicação
│   ├── controller/          # Controllers (REST API)
│   ├── domain/              # Regras de negócio
│   │   ├── entities/       # Entidades de domínio
│   │   ├── dto/            # Data Transfer Objects
│   │   └── errors/         # Erros de domínio
│   ├── ports/              # Interfaces (Portas)
│   │   ├── input/          # Portas de entrada (Use Cases)
│   │   └── output/         # Portas de saída (Gateways)
│   ├── use-cases/          # Casos de uso
│   ├── presenter/          # Apresentadores
│   ├── swagger/            # Documentação API
│   ├── utils/              # Utilitários
│   └── value-objects/      # Objetos de valor
├── infrastructure/          # Camada de infraestrutura
│   ├── gateway/            # Integrações externas
│   │   ├── auth/          # Gateway de autenticação
│   │   ├── payment/       # Gateway de pagamento
│   │   └── products/      # Gateway de produtos
│   └── persistence/        # Persistência de dados
│       ├── prisma/        # Configuração Prisma
│       ├── repositories/  # Implementação de repositórios
│       └── mappers/       # Mapeadores de dados
└── shared/                 # Código compartilhado
    └── types/             # Tipos TypeScript
```

### Fluxo de Dados

```
Request → Controller → Use Case → Repository/Gateway → Database/External API
                ↓
           Presenter → Response
```

---

## 🚀 Como Usar

### Requisitos

- Node.js 20+
- Docker e Docker Compose
- PostgreSQL 15
- NPM Token para `@vineco77/auth-lib`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Luckmenez/11soat-node-orders.git
cd 11soat-node-orders

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Configure o NPM token (obrigatório)
cp .npmrc.example .npmrc
# Edite .npmrc e adicione seu token do GitHub

# Suba o banco de dados com Docker
docker-compose up -d

# Execute as migrações
npm run prisma:migrate

# Inicie o servidor
npm run start:dev
```

---

## 📡 Endpoints Disponíveis

A documentação Swagger está disponível em: `http://localhost:3000/api`

### Orders Controller (`/orders`)

#### 1. Criar Pedido

```http
POST /orders/create-order
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "observation": "Sem cebola",
      "customerItems": [
        {
          "itemId": 10,
          "quantity": 1
        }
      ]
    }
  ],
  "observation": "Entregar rápido"
}
```

**Response:**

```json
{
  "id": 123,
  "clientCpf": "12345678900",
  "status": "PENDING",
  "amount": 45.90,
  "items": [...],
  "payment": {
    "qrCode": "00020101021243650016COM...",
    "transactionId": "txn_123456"
  },
  "createdAt": "2024-01-08T10:30:00Z"
}
```

#### 2. Listar Pedidos (Paginado)

```http
GET /orders/get-paginated?page=1&limit=10
```

**Response:**

```json
{
  "data": [
    {
      "id": 123,
      "clientCpf": "12345678900",
      "status": "PENDING",
      "amount": 45.9,
      "createdAt": "2024-01-08T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 3. Atualizar Status de Pagamento

```http
PATCH /orders/update-order-payment/:orderId
```

**Request Body:**

```json
{
  "status": "PAID",
  "transactionId": "txn_123456"
}
```

#### 4. Deletar Pedido

```http
DELETE /orders/delete-order/:orderId
```

---

## 🔐 Autenticação

O serviço utiliza JWT tokens fornecidos pelo **Auth Service** (`@vineco77/auth-lib`).

### Tipos de Usuário Suportados:

1. **Cliente Identificado**: Token com CPF válido
2. **Cliente Anônimo**: Token sem CPF (gerado com código aleatório)

**Exemplo de Header:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Modelo de Dados

### Order (Pedido)

```prisma
model Order {
  id                Int         @id @default(autoincrement())
  clientCpf         String?
  status            OrderStatus
  amount            Decimal
  transactionId     String?
  isRandomClient    Boolean     @default(false)
  codeClientRandom  Int?
  observation       String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  items             OrderItem[]
}
```

### OrderItem (Item do Pedido)

```prisma
model OrderItem {
  id          Int     @id @default(autoincrement())
  orderId     Int
  productId   Int
  title       String
  description String?
  photo       String?
  quantity    Int
  price       Decimal
  unitPrice   Decimal
  observation String?
  type        String
  customerItems OrderItemCustomization[]
}
```

### OrderItemCustomization (Customização)

```prisma
model OrderItemCustomization {
  id          Int     @id @default(autoincrement())
  orderItemId Int
  title       String
  quantity    Int
  price       Decimal
  unitPrice   Decimal
  type        String
}
```

### Status do Pedido

| Status             | Descrição              |
| ------------------ | ---------------------- |
| `PENDING`          | Aguardando pagamento   |
| `PAID`             | Pagamento confirmado   |
| `CANCELED`         | Pedido cancelado       |
| `FAILED`           | Falha no processamento |
| `IN_PREPARATION`   | Em preparação          |
| `READY_TO_DELIVER` | Pronto para entrega    |
| `DONE`             | Finalizado             |

---

## 🧪 Testes

### Tipos de Testes

1. **Testes Unitários**

```bash
npm run test:unit
```

2. **Testes de Integração**

```bash
npm run test:integration
```

3. **Testes E2E**

```bash
npm run test:e2e
```

4. **Testes BDD (Behavior Driven Development)**

```bash
npm run test:bdd
```

5. **Cobertura de Testes**

```bash
npm run test:cov
```

6. **Todos os Testes**

```bash
npm run test:all
```

### Estrutura de Testes BDD

Os testes BDD seguem a metodologia Cucumber/Gherkin:

```
test/
├── features/              # Cenários em Gherkin
│   ├── create-order.feature
│   ├── get-orders-paginated.feature
│   └── update-order-payment.feature
└── step-definitions/      # Implementação dos steps
```

**Exemplo de Feature:**

```gherkin
Feature: Create Order
  As a customer
  I want to create an order with items
  So that I can purchase products

  Scenario: Successfully create order with valid items
    Given I am authenticated with a valid token
    And I have a valid order with 2 items
    When I create the order
    Then the order should be created successfully
    And the order should have an ID
    And a payment should be generated with QR code
```

---

## 🔧 Tecnologias Utilizadas

### Backend

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados relacional
- **Joi** - Validação de schemas
- **Class Validator** - Validação de DTOs

### Integrações

- **@vineco77/auth-lib** - Biblioteca de autenticação
- **Axios** - Cliente HTTP
- **NestJS Axios** - Módulo Axios para NestJS

### Testes

- **Jest** - Framework de testes
- **Jest-Cucumber** - Testes BDD
- **Supertest** - Testes de integração HTTP

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **SonarCloud** - Análise de qualidade de código
- **Terraform** - Infrastructure as Code (AWS)

### Documentação

- **Swagger/OpenAPI** - Documentação de API

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:debug        # Inicia em modo debug
npm run start:prod         # Inicia em modo produção

# Build
npm run build              # Compila o projeto

# Testes
npm test                   # Executa testes unitários
npm run test:watch         # Testes em modo watch
npm run test:cov           # Gera cobertura de testes
npm run test:unit          # Executa apenas testes unitários
npm run test:unit:cov      # Cobertura dos testes unitários
npm run test:integration   # Executa testes de integração
npm run test:e2e           # Executa testes E2E
npm run test:bdd           # Executa testes BDD
npm run test:all           # Executa todos os testes

# Banco de Dados
npm run prisma:generate    # Gera Prisma Client
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre Prisma Studio
npm run prisma:deploy      # Deploy de migrações (produção)

# Qualidade de Código
npm run lint               # Executa linter
npm run format             # Formata código
npm run sonar              # Executa análise SonarCloud
```

---

## 🐳 Docker

### Desenvolvimento

```bash
# Subir apenas o banco de dados
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

### Produção

O projeto inclui um Dockerfile multi-stage otimizado para produção:

```bash
# Build da imagem (requer NPM token como secret)
docker build --secret id=npm_token,src=.npmrc -t orders-service .

# Executar container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  orders-service
```

**Características do Dockerfile:**

- Multi-stage build para imagens menores
- Build secrets para NPM token seguro
- Non-root user para segurança
- Health check integrado
- Otimizado para produção

---

## ☁️ Deploy na AWS (Terraform)

O projeto inclui infraestrutura completa como código usando Terraform.

### Arquitetura AWS

- **ECS Fargate**: Orquestração de containers serverless
- **RDS PostgreSQL**: Banco de dados gerenciado
- **Application Load Balancer**: Balanceamento de carga
- **ECR**: Registro de imagens Docker
- **Auto Scaling**: Escalabilidade automática
- **CloudWatch**: Logs e monitoramento
- **VPC**: Rede isolada com subnets públicas e privadas

### Quick Deploy

```bash
cd terraform

# Configurar variáveis
cp terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars com seus valores

# Inicializar Terraform
terraform init

# Planejar mudanças
terraform plan

# Aplicar infraestrutura
terraform apply

# Fazer deploy da aplicação
./deploy.sh
```

Para mais detalhes, consulte a [documentação do Terraform](./terraform/README.md).

**Custo estimado:** ~$113-130/mês (us-east-1)

---

## 🌐 Integrações com Microserviços

### 1. Auth Service

- **Endpoint**: Configurado via `JWT_SECRET`
- **Função**: Validação de tokens JWT
- **Biblioteca**: `@vineco77/auth-lib`

### 2. Products Service

- **Endpoint**: `PRODUCTS_SERVICE_URL`
- **Função**: Consulta de produtos e preços
- **Timeout**: `PRODUCTS_SERVICE_TIMEOUT` (padrão: 5000ms)

### 3. Payment Gateway

- **Endpoint**: Configurado no Terraform ou variáveis de ambiente
- **Função**: Geração de QR Code e processamento de pagamentos
- **Resposta**: Transaction ID e QR Code PIX

---

## ⚙️ Variáveis de Ambiente

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/orders_db?schema=public"

# External Services
PRODUCTS_SERVICE_URL=http://localhost:3001/products
PRODUCTS_SERVICE_TIMEOUT=5000

# Authentication
JWT_SECRET=your-jwt-secret-here
```

Consulte [.env.example](./.env.example) para todas as variáveis disponíveis.

---

## 📚 Documentação Adicional

- [Guia de Deploy AWS](./.github/workflows/AWS_DEPLOY_GUIDE.md)
- [Terraform README](./terraform/README.md)
- [Quick Deploy Guide](./terraform/QUICK_DEPLOY.md)
- [Cost Optimization](./terraform/COST_OPTIMIZATION.md)
- [Security - NPM Token Setup](./docs/SECURITY_NPM_TOKEN.md)

---

## 🔒 Segurança

### Práticas Implementadas

- ✅ Autenticação JWT obrigatória
- ✅ Validação de entrada com Class Validator
- ✅ Sanitização de dados
- ✅ Proteção contra SQL Injection (Prisma)
- ✅ CORS configurável
- ✅ Rate limiting (configurável)
- ✅ Secrets em variáveis de ambiente
- ✅ Docker non-root user
- ✅ Health checks

### SonarCloud

O projeto utiliza SonarCloud para análise contínua de:

- Bugs
- Vulnerabilidades
- Code Smells
- Duplicação de código
- Cobertura de testes

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Seguir princípios SOLID
- Manter Clean Architecture
- Cobertura de testes mínima: 80%
- Usar Conventional Commits
- Passar no Quality Gate do SonarCloud

---

## 👥 Autores

- **Lucas Menezes** - [Luckmenez](https://github.com/Luckmenez)

---

## 📄 Licença

Este projeto foi desenvolvido como parte do trabalho acadêmico da FIAP - 11SOAT.

---

## ✅ Status do Projeto

✅ **Ativo** - Versão 0.0.1

- [x] CRUD de pedidos
- [x] Integração com gateway de pagamentos
- [x] Integração com serviço de produtos
- [x] Autenticação JWT
- [x] Validação de dados
- [x] Paginação
- [x] Testes unitários e BDD
- [x] Cobertura > 80%
- [x] Documentação Swagger
- [x] Docker e Docker Compose
- [x] Infraestrutura AWS (Terraform)
- [x] Clean Architecture
- [x] CI/CD com GitHub Actions

### Roadmap

- [ ] WebSockets para atualização em tempo real
- [ ] Filas (SQS/RabbitMQ) para processamento assíncrono
- [ ] Cache (Redis) para otimização
- [ ] Metrics e Observability (Prometheus/Grafana)
- [ ] Event Sourcing

---

**Desenvolvido com dedicação pela equipe 11SOAT**
