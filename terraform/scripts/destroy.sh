#!/bin/bash

set -e

echo "💥 Destroy Script - 11soat Orders"
echo "=================================="
echo ""
echo "⚠️  ATENÇÃO: Isso destruirá TODA a infraestrutura!"
echo ""

read -p "Tem certeza que deseja continuar? (digite 'yes'): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operação cancelada."
    exit 0
fi

echo ""
echo "🗑️  Destruindo infraestrutura..."
echo "⏱️  Isso levará ~10 minutos"
echo ""

# Try to destroy normally
terraform destroy -auto-approve

echo ""
echo "✅ Infraestrutura destruída!"
echo ""

# Verify everything was destroyed
echo "🔍 Verificando recursos remanescentes..."
echo ""

echo "Verificando VPC..."
VPC_COUNT=$(aws ec2 describe-vpcs \
  --filters "Name=tag:Project,Values=11soat-orders" \
  --region us-east-1 \
  --query 'length(Vpcs)' \
  --output text 2>/dev/null || echo "0")

if [ "$VPC_COUNT" = "0" ]; then
    echo "  ✅ VPC removida"
else
    echo "  ⚠️  VPC ainda existe ($VPC_COUNT)"
fi

echo "Verificando RDS..."
RDS_COUNT=$(aws rds describe-db-instances \
  --region us-east-1 \
  --query "length(DBInstances[?contains(DBInstanceIdentifier, '11soat-orders')])" \
  --output text 2>/dev/null || echo "0")

if [ "$RDS_COUNT" = "0" ]; then
    echo "  ✅ RDS removido"
else
    echo "  ⚠️  RDS ainda existe ($RDS_COUNT)"
fi

echo "Verificando ECS Cluster..."
CLUSTER_COUNT=$(aws ecs list-clusters \
  --region us-east-1 \
  --query "length(clusterArns[?contains(@, '11soat-orders')])" \
  --output text 2>/dev/null || echo "0")

if [ "$CLUSTER_COUNT" = "0" ]; then
    echo "  ✅ ECS Cluster removido"
else
    echo "  ⚠️  ECS Cluster ainda existe ($CLUSTER_COUNT)"
fi

echo "Verificando ALB..."
ALB_COUNT=$(aws elbv2 describe-load-balancers \
  --region us-east-1 \
  --query "length(LoadBalancers[?contains(LoadBalancerName, '11soat-orders')])" \
  --output text 2>/dev/null || echo "0")

if [ "$ALB_COUNT" = "0" ]; then
    echo "  ✅ ALB removido"
else
    echo "  ⚠️  ALB ainda existe ($ALB_COUNT)"
fi

echo ""
echo "📊 Verificar custos em:"
echo "   https://console.aws.amazon.com/cost-management/home#/dashboard"
echo ""
echo "🎉 Processo concluído!"
echo ""
