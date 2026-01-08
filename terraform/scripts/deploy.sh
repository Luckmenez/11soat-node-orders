#!/bin/bash

set -e

echo "🚀 Deploy Script - 11soat Orders"
echo "=================================="
echo ""

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo "❌ Erro: terraform.tfvars não encontrado!"
    echo "Execute: cp terraform.tfvars.example terraform.tfvars"
    echo "E edite com seus valores."
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Erro: AWS CLI não configurado!"
    echo "Execute: aws configure"
    exit 1
fi

echo "✅ Pré-requisitos verificados"
echo ""

# Step 1: Terraform Init
echo "📦 Passo 1/5: Inicializando Terraform..."
terraform init -upgrade
echo ""

# Step 2: Terraform Apply
echo "🏗️  Passo 2/5: Provisionando infraestrutura..."
echo "⏱️  Isso levará ~15-20 minutos"
terraform apply -auto-approve
echo ""

# Step 3: Build and Push Docker Image
echo "🐳 Passo 3/5: Build e Push da imagem Docker..."
ECR_URL=$(terraform output -raw ecr_repository_url)
echo "ECR URL: $ECR_URL"

# Login to ECR
echo "🔐 Fazendo login no ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL

# Build image
echo "🔨 Construindo imagem Docker..."
cd ..
docker build -t $ECR_URL:latest .

# Push image
echo "⬆️  Enviando imagem para ECR..."
docker push $ECR_URL:latest
cd terraform
echo ""

# Step 4: Run Prisma Migrations
echo "🗄️  Passo 4/5: Executando migrations do Prisma..."
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
DB_USERNAME=$(grep 'db_username' terraform.tfvars | cut -d '=' -f2 | tr -d ' "')
DB_PASSWORD=$(grep 'db_password' terraform.tfvars | cut -d '=' -f2 | tr -d ' "')
DB_NAME=$(terraform output -raw rds_database_name)

export DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${RDS_ENDPOINT}/${DB_NAME}"

cd ..
npx prisma migrate deploy --schema=./src/infrastructure/persistence/prisma/schema.prisma
cd terraform
echo ""

# Step 5: Deploy to ECS
echo "🚢 Passo 5/5: Fazendo deploy no ECS..."
CLUSTER_NAME=$(terraform output -raw ecs_cluster_name)
SERVICE_NAME=$(terraform output -raw ecs_service_name)

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment \
  --region us-east-1 > /dev/null

echo "⏱️  Aguardando ECS tasks subirem (isso pode levar ~5 minutos)..."
aws ecs wait services-stable \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --region us-east-1

echo ""
echo "✅ Deploy concluído com sucesso!"
echo ""
echo "🌐 Acesse sua aplicação em:"
terraform output alb_url
echo ""
echo "📊 Para ver logs:"
echo "   aws logs tail /ecs/11soat-orders-demo --follow --region us-east-1"
echo ""
echo "⚠️  NÃO ESQUEÇA DE DESTRUIR após uso:"
echo "   ./scripts/destroy.sh"
echo ""
