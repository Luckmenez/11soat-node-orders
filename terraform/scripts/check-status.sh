#!/bin/bash

echo "📊 Status da Infraestrutura - 11soat Orders"
echo "==========================================="
echo ""

if [ ! -f "terraform.tfstate" ]; then
    echo "❌ Nenhuma infraestrutura provisionada (terraform.tfstate não encontrado)"
    exit 0
fi

echo "🔍 Verificando recursos..."
echo ""

# Get outputs
CLUSTER_NAME=$(terraform output -raw ecs_cluster_name 2>/dev/null)
SERVICE_NAME=$(terraform output -raw ecs_service_name 2>/dev/null)
ALB_URL=$(terraform output -raw alb_url 2>/dev/null)

if [ -z "$CLUSTER_NAME" ]; then
    echo "❌ Infraestrutura não está provisionada"
    exit 0
fi

# Check ECS Service
echo "📦 ECS Service:"
SERVICE_STATUS=$(aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --region us-east-1 \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Pending:pendingCount}' \
  --output json 2>/dev/null)

if [ -n "$SERVICE_STATUS" ]; then
    echo "$SERVICE_STATUS" | jq '.'
else
    echo "  ❌ Serviço não encontrado"
fi
echo ""

# Check ALB Target Health
echo "🎯 ALB Target Health:"
TARGET_GROUP_ARN=$(terraform output -raw alb_target_group_arn 2>/dev/null)

if [ -n "$TARGET_GROUP_ARN" ]; then
    aws elbv2 describe-target-health \
      --target-group-arn $TARGET_GROUP_ARN \
      --region us-east-1 \
      --query 'TargetHealthDescriptions[*].{Target:Target.Id,Port:Target.Port,Health:TargetHealth.State}' \
      --output table 2>/dev/null || echo "  ⚠️  Nenhum target registrado"
else
    echo "  ❌ Target Group não encontrado"
fi
echo ""

# Check RDS
echo "🗄️  RDS Database:"
RDS_ENDPOINT=$(terraform output -raw rds_endpoint 2>/dev/null)

if [ -n "$RDS_ENDPOINT" ]; then
    DB_INSTANCE=$(echo $RDS_ENDPOINT | cut -d: -f1)
    aws rds describe-db-instances \
      --db-instance-identifier $DB_INSTANCE \
      --region us-east-1 \
      --query 'DBInstances[0].{Status:DBInstanceStatus,Class:DBInstanceClass,Engine:Engine,Storage:AllocatedStorage}' \
      --output table 2>/dev/null || echo "  ❌ RDS não encontrado"
else
    echo "  ❌ RDS não encontrado"
fi
echo ""

# Test Application Health
echo "🏥 Application Health:"
if [ -n "$ALB_URL" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${ALB_URL}/health 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        echo "  ✅ Health check OK (HTTP $HTTP_CODE)"
    else
        echo "  ❌ Health check FAILED (HTTP $HTTP_CODE)"
    fi
else
    echo "  ❌ ALB URL não disponível"
fi
echo ""

# Application URL
echo "🌐 Application URL:"
if [ -n "$ALB_URL" ]; then
    echo "   $ALB_URL"
else
    echo "  ❌ URL não disponível"
fi
echo ""

# Recent Logs
echo "📝 Recent Logs (últimas 10 linhas):"
aws logs tail /ecs/11soat-orders-demo \
  --since 5m \
  --format short \
  --region us-east-1 2>/dev/null | tail -10 || echo "  ⚠️  Nenhum log recente"
echo ""

# Cost Estimate
echo "💰 Estimativa de Custo (por hora):"
echo "   NAT Gateway (2): ~$0.09/hora"
echo "   ECS Fargate: ~$0.01/hora"
echo "   RDS t3.micro: ~$0.02/hora"
echo "   ALB: ~$0.03/hora"
echo "   ────────────────────────────"
echo "   TOTAL: ~$0.15/hora (~$3.60/dia)"
echo ""
echo "⚠️  Lembre-se de executar ./scripts/destroy.sh após o uso!"
echo ""
