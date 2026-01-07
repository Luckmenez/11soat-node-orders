# Terraform Infrastructure for 11soat Orders Service

This Terraform configuration provisions the complete AWS infrastructure for the Orders microservice using ECS Fargate.

## Architecture

The infrastructure includes:

- **VPC**: Custom VPC with public and private subnets across 2 availability zones
- **ECS Fargate**: Serverless container orchestration
- **RDS PostgreSQL**: Managed database service
- **Application Load Balancer**: HTTP/HTTPS load balancing
- **ECR**: Container image registry
- **Auto Scaling**: CPU and memory-based scaling
- **CloudWatch**: Logging and monitoring

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.0 installed
3. **Docker** for building container images
4. **AWS Account** with permissions to create resources

## Quick Start

### 1. Configure Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your specific values:

```hcl
db_username = "your_db_username"
db_password = "your_secure_password"
npm_token = "your_npm_token"
payment_gateway_url = "https://your-payment-service.com"
auth_gateway_url = "https://your-auth-service.com"
products_gateway_url = "https://your-products-service.com"
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Infrastructure

```bash
terraform plan
```

### 4. Apply Infrastructure

```bash
terraform apply
```

Type `yes` when prompted to confirm.

### 5. Build and Push Docker Image

After infrastructure is created, get the ECR repository URL:

```bash
ECR_URL=$(terraform output -raw ecr_repository_url)
AWS_REGION="us-east-1"
```

Login to ECR:

```bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL
```

Build and push the image:

```bash
cd ..
docker build -t $ECR_URL:latest .
docker push $ECR_URL:latest
```

### 6. Update ECS Service

Force new deployment to use the new image:

```bash
cd terraform
aws ecs update-service \
  --cluster $(terraform output -raw ecs_cluster_name) \
  --service $(terraform output -raw ecs_service_name) \
  --force-new-deployment \
  --region us-east-1
```

### 7. Access Your Application

Get the Load Balancer URL:

```bash
terraform output alb_url
```

## Important Outputs

- `alb_url`: URL to access your application
- `ecr_repository_url`: ECR repository for Docker images
- `ecs_cluster_name`: ECS cluster name
- `rds_endpoint`: Database endpoint (sensitive)

## Database Migrations

Run Prisma migrations against the RDS instance:

```bash
# Get database URL (this is sensitive!)
DB_URL=$(terraform output -raw rds_endpoint)

# Set DATABASE_URL and run migrations
export DATABASE_URL="postgresql://username:password@$DB_URL/orders_db"
npx prisma migrate deploy
```

## Cost Estimation

**Approximate monthly costs (us-east-1):**

- **ECS Fargate** (2 tasks, 0.25 vCPU, 512 MB): ~$15/month
- **RDS db.t3.micro** (20 GB): ~$15/month
- **ALB**: ~$18/month + data transfer
- **NAT Gateway** (2 AZs): ~$65/month
- **Data Transfer**: Variable

**Total: ~$113-130/month** (excluding data transfer)

## Production Considerations

### Security

1. **Secrets Management**: Use AWS Secrets Manager or Parameter Store for sensitive values
2. **Database Password**: Generate a strong password and store securely
3. **SSL/TLS**: Add ACM certificate ARN to `certificate_arn` variable for HTTPS
4. **Network ACLs**: Consider adding network ACLs for additional security

### High Availability

1. **Multi-AZ RDS**: Enabled by default in this configuration
2. **Auto Scaling**: Configured for CPU (70%) and Memory (80%) thresholds
3. **Health Checks**: ALB performs health checks on `/health` endpoint

### Monitoring

1. **CloudWatch Logs**: ECS logs are sent to `/ecs/11soat-orders-prod`
2. **RDS Enhanced Monitoring**: Enabled with 60-second granularity
3. **Container Insights**: Enabled on ECS cluster

### Backups

1. **RDS Automated Backups**: 7-day retention (configurable)
2. **RDS Snapshots**: Manual snapshots recommended before major changes
3. **Final Snapshot**: Taken automatically on RDS deletion (unless skip_final_snapshot = true)

## Remote State (Recommended for Production)

Uncomment and configure the backend in `main.tf`:

```hcl
backend "s3" {
  bucket         = "your-terraform-state-bucket"
  key            = "11soat-orders/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-state-lock"
}
```

Create the S3 bucket and DynamoDB table:

```bash
aws s3 mb s3://your-terraform-state-bucket
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

## Destroying Infrastructure

**WARNING**: This will delete all resources including the database!

```bash
terraform destroy
```

## Troubleshooting

### ECS Tasks Not Starting

Check CloudWatch logs:

```bash
aws logs tail /ecs/11soat-orders-prod --follow
```

### Database Connection Issues

1. Verify security groups allow ECS -> RDS communication
2. Check DATABASE_URL environment variable in task definition
3. Ensure RDS is in `available` state

### ALB Health Checks Failing

1. Ensure your app exposes `/health` endpoint
2. Check ECS task logs for startup errors
3. Verify container port matches task definition

## Module Structure

```
terraform/
├── main.tf                 # Root module
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── terraform.tfvars.example # Example variables
├── modules/
│   ├── vpc/               # VPC module
│   ├── ecs/               # ECS Fargate module
│   ├── rds/               # RDS PostgreSQL module
│   ├── alb/               # Application Load Balancer module
│   └── ecr/               # ECR repository module
```

## Support

For issues or questions:
- Open an issue in the repository
- Check AWS service status: https://status.aws.amazon.com/

## License

This infrastructure code is part of the 11soat Orders project.
