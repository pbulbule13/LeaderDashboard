# Deployment Guide - Leader Dashboard

## Overview
CEO Leadership Dashboard for healthcare sciences - built with Python and deployed to Google Cloud Storage (static frontend) and Cloud Run (API backend).

**Service Name:** `ceo-dashboard-api` (Backend)
**Frontend:** Google Cloud Storage static hosting
**Port:** 8080
**Type:** Python application
**Runtime:** Python 3.11
**Projects:**
- API: `ceoleadershipdashboard`
- Frontend: Google Cloud Storage

---

## Prerequisites

- Python 3.11+
- Docker
- Cloud CLI tools
- Access to GCP project: `ceoleadershipdashboard`

---

## Environment Variables

```bash
TEST_MODE=true  # Set to false for production
# Add other required API keys and credentials
```

---

## Architecture

This application has a unique deployment architecture:
1. **Backend API**: Deployed to Cloud Run in `ceoleadershipdashboard` project
2. **Frontend**: Static files hosted on Google Cloud Storage
3. **Bucket**: `ceo-dashboard-web-ceoleadershipdashboard`

---

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/pbulbule13/LeaderDashboard.git
cd LeaderDashboard
```

### 2. Install Dependencies
```bash
cd healthcare_sciences_dashboard
pip install -r requirements.txt
```

### 3. Run API Server
```bash
cd healthcare_sciences_dashboard/api
python server.py
```
Visit: http://localhost:8080

### 4. Serve Frontend Locally
```bash
cd healthcare_sciences_dashboard
python -m http.server 8000
```
Visit: http://localhost:8000/dashboard.html

---

## Deployment to Google Cloud Platform (GCP)

### Automated CI/CD (Recommended)

**Cloud Build Trigger is configured** to deploy on push to `main` branch.

```bash
# Trigger details
Name: leaderdashboard-auto-deploy
Repository: pbulbule13/LeaderDashboard
Branch: ^main$
Project: pbulbule-apps-1762314316
```

### Manual Deployment (Full Stack)

Use the provided deployment script:

```bash
# Edit ~/deploy.sh and verify these variables:
# PROJECT_ID="ceoleadershipdashboard"
# BUCKET="ceo-dashboard-web-ceoleadershipdashboard"
# SERVICE="ceo-dashboard-api"

bash ~/deploy.sh
```

### Manual Deployment (Step-by-Step)

#### 1. Setup Project and Services
```bash
PROJECT_ID="ceoleadershipdashboard"
REGION="us-central1"
REPO="ceo-docker"
SERVICE="ceo-dashboard-api"
BUCKET="ceo-dashboard-web-ceoleadershipdashboard"

gcloud config set project $PROJECT_ID

# Enable required services
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

#### 2. Create Artifact Registry (if needed)
```bash
gcloud artifacts repositories create $REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="CEO Dashboard containers"

gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
```

#### 3. Build and Push Container
```bash
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/ceo-dashboard-api:$(date +%Y%m%d-%H%M%S)"

gcloud builds submit --tag $IMAGE .
```

#### 4. Deploy API to Cloud Run
```bash
gcloud run deploy $SERVICE \
  --image $IMAGE \
  --region $REGION \
  --allow-unauthenticated \
  --platform managed \
  --memory 512Mi \
  --concurrency 80 \
  --max-instances 10 \
  --set-env-vars TEST_MODE=true
```

#### 5. Get API URL
```bash
RUN_URL=$(gcloud run services describe $SERVICE --region $REGION --format='value(status.url)')
echo "API URL: $RUN_URL"
```

#### 6. Update Frontend Config
```bash
# Update config.js with API URL
sed -i "s|baseUrl: '[^']*'|baseUrl: '${RUN_URL}'|g" healthcare_sciences_dashboard/config.js
```

#### 7. Create Storage Bucket (if needed)
```bash
gsutil mb -l $REGION gs://$BUCKET
gsutil iam ch allUsers:objectViewer gs://$BUCKET
```

#### 8. Upload Frontend
```bash
gsutil -m rsync -r -d ./healthcare_sciences_dashboard gs://$BUCKET
gsutil web set -m dashboard.html -e 404.html gs://$BUCKET
```

#### 9. Get Frontend URL
```bash
FRONTEND_URL="https://storage.googleapis.com/${BUCKET}/dashboard.html"
echo "Frontend URL: $FRONTEND_URL"
```

---

## Deployment to AWS

### AWS Architecture
- **Backend**: ECS Fargate or Elastic Beanstalk
- **Frontend**: S3 + CloudFront

#### Backend (ECS)
```bash
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create ECR repository
aws ecr create-repository --repository-name leader-dashboard-api --region $AWS_REGION

# Build and push
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
docker build -t leader-dashboard-api .
docker tag leader-dashboard-api:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/leader-dashboard-api:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/leader-dashboard-api:latest

# Deploy to ECS (requires VPC and task definition)
```

#### Frontend (S3)
```bash
BUCKET_NAME="leader-dashboard-frontend"

# Create bucket
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Configure for static website
aws s3 website s3://$BUCKET_NAME --index-document dashboard.html

# Upload files
aws s3 sync ./healthcare_sciences_dashboard s3://$BUCKET_NAME

# Make public
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
  }]
}'
```

---

## Deployment to Azure

### Azure Architecture
- **Backend**: Azure Container Instances or App Service
- **Frontend**: Azure Storage Static Website

#### Backend (Container Instances)
```bash
RESOURCE_GROUP="leader-dashboard-rg"
LOCATION="eastus"
ACR_NAME="leaderdashboardacr"

# Create resources
az group create --name $RESOURCE_GROUP --location $LOCATION
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic
az acr build --registry $ACR_NAME --image leader-dashboard-api:latest .

# Deploy
az container create \
  --resource-group $RESOURCE_GROUP \
  --name leader-dashboard-api \
  --image ${ACR_NAME}.azurecr.io/leader-dashboard-api:latest \
  --cpu 1 --memory 0.5 \
  --ports 8080 \
  --environment-variables TEST_MODE=true
```

#### Frontend (Static Website)
```bash
STORAGE_ACCOUNT="leaderdashboardfe"

# Create storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

# Enable static website
az storage blob service-properties update \
  --account-name $STORAGE_ACCOUNT \
  --static-website \
  --index-document dashboard.html

# Upload files
az storage blob upload-batch \
  --account-name $STORAGE_ACCOUNT \
  --source ./healthcare_sciences_dashboard \
  --destination '$web'
```

---

## Monitoring & Logs

### GCP
```bash
# API logs
gcloud run services logs read ceo-dashboard-api --project ceoleadershipdashboard --limit=50

# Build logs
gcloud builds log <BUILD_ID>
```

### Health Check
```bash
curl https://BACKEND_URL/health
```

---

## URLs

- **Production Frontend:** https://storage.googleapis.com/ceo-dashboard-web-ceoleadershipdashboard/dashboard.html
- **Production API:** (Deployed in ceoleadershipdashboard project)
- **GitHub Repository:** https://github.com/pbulbule13/LeaderDashboard

---

## Troubleshooting

**Issue: Frontend can't connect to API**
- Verify config.js has correct API URL
- Check CORS settings on API
- Ensure API is deployed and running

**Issue: Bucket permissions**
```bash
gsutil iam ch allUsers:objectViewer gs://ceo-dashboard-web-ceoleadershipdashboard
```

---

**Last Updated:** 2025-11-18
**Maintainer:** Prashil Bulbule
