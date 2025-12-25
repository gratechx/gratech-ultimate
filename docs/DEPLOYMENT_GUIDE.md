# ==========================================
# GraTech Ultimate - Deployment Guide
# Complete guide for all environments
# ==========================================

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Azure Deployment](#azure-deployment)
5. [Production Checklist](#production-checklist)

---

## 📦 Prerequisites

### Required Software
- Node.js 20+ (LTS)
- Python 3.11+
- Docker & Docker Compose (for containerized deployment)
- Azure CLI (for Azure deployment)
- Git

### Required API Keys
| Service | Purpose | Get Key |
|---------|---------|---------|
| Google AI | Gemini, Veo, Imagen, TTS | [ai.google.dev](https://ai.google.dev) |
| Azure AI | DeepSeek, Llama, GPT-5 | [Azure Portal](https://portal.azure.com) |
| Azure OpenAI | GPT-4o | [Azure OpenAI](https://oai.azure.com) |

---

## 💻 Local Development

### 1. Clone & Setup

```powershell
# Clone the repository
git clone https://github.com/GrAxOS/GraTech-Ultimate.git
cd GraTech-Ultimate

# Copy environment file
cp .env.example .env
# Edit .env with your API keys
```

### 2. Frontend Setup

```powershell
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Backend Setup

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`

### 4. Chrome Extension (Optional)

```powershell
# Open Chrome
# Go to chrome://extensions
# Enable "Developer mode"
# Click "Load unpacked"
# Select: GraTech-Ultimate/extension
```

---

## 🐳 Docker Deployment

### Quick Start

```powershell
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services
| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8000 | http://localhost:8000 |
| Redis | 6379 | redis://localhost:6379 |

### Production Mode

```powershell
# Include nginx reverse proxy
docker-compose --profile production up -d
```

---

## ☁️ Azure Deployment

### Option 1: Azure Container Apps (Recommended)

#### 1. Login to Azure

```powershell
az login
az account set --subscription "dde8416c-6077-4b2b-b722-05bf8b782c44"
```

#### 2. Create Resources

```powershell
# Variables
$RG = "gratech-rg"
$LOCATION = "uaenorth"
$ACR = "gratechacr"
$ENV = "gratech-env"

# Create Resource Group
az group create --name $RG --location $LOCATION

# Create Container Registry
az acr create --name $ACR --resource-group $RG --sku Basic --admin-enabled true

# Get ACR credentials
az acr credential show --name $ACR

# Login to ACR
az acr login --name $ACR
```

#### 3. Build & Push Images

```powershell
# Build frontend
docker build -f Dockerfile.frontend -t $ACR.azurecr.io/gratech-frontend:latest .
docker push $ACR.azurecr.io/gratech-frontend:latest

# Build backend
docker build -f backend/Dockerfile -t $ACR.azurecr.io/gratech-backend:latest ./backend
docker push $ACR.azurecr.io/gratech-backend:latest
```

#### 4. Create Container Apps Environment

```powershell
az containerapp env create \
  --name $ENV \
  --resource-group $RG \
  --location $LOCATION
```

#### 5. Deploy Backend

```powershell
az containerapp create \
  --name gratech-backend \
  --resource-group $RG \
  --environment $ENV \
  --image $ACR.azurecr.io/gratech-backend:latest \
  --registry-server $ACR.azurecr.io \
  --target-port 8000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 10 \
  --secrets "google-api-key=YOUR_KEY" "azure-api-key=YOUR_KEY" \
  --env-vars "GOOGLE_API_KEY=secretref:google-api-key"
```

#### 6. Deploy Frontend

```powershell
# Get backend URL
$BACKEND_URL = az containerapp show --name gratech-backend --resource-group $RG --query "properties.configuration.ingress.fqdn" -o tsv

az containerapp create \
  --name gratech-frontend \
  --resource-group $RG \
  --environment $ENV \
  --image $ACR.azurecr.io/gratech-frontend:latest \
  --registry-server $ACR.azurecr.io \
  --target-port 80 \
  --ingress external \
  --min-replicas 1 \
  --env-vars "VITE_API_URL=https://$BACKEND_URL"
```

### Option 2: Azure Static Web Apps + Azure Functions

For the frontend only (static hosting):

```powershell
# Create Static Web App
az staticwebapp create \
  --name gratech-web \
  --resource-group $RG \
  --source https://github.com/GrAxOS/GraTech-Ultimate \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

---

## 🌐 Custom Domain Setup (gratech.sa)

### 1. Azure DNS Configuration

```powershell
# Create DNS Zone (if not exists)
az network dns zone create \
  --resource-group $RG \
  --name gratech.sa

# Get nameservers
az network dns zone show \
  --resource-group $RG \
  --name gratech.sa \
  --query "nameServers"
```

### 2. Add DNS Records

```powershell
# A record for apex domain
az network dns record-set a add-record \
  --resource-group $RG \
  --zone-name gratech.sa \
  --record-set-name "@" \
  --ipv4-address <CONTAINER_APP_IP>

# CNAME for www
az network dns record-set cname create \
  --resource-group $RG \
  --zone-name gratech.sa \
  --name www

az network dns record-set cname set-record \
  --resource-group $RG \
  --zone-name gratech.sa \
  --record-set-name www \
  --cname gratech-frontend.azurecontainerapps.io
```

### 3. SSL Certificate

Azure Container Apps handles SSL automatically. For custom domains:

```powershell
az containerapp hostname add \
  --name gratech-frontend \
  --resource-group $RG \
  --hostname www.gratech.sa

az containerapp hostname bind \
  --name gratech-frontend \
  --resource-group $RG \
  --hostname www.gratech.sa \
  --certificate managed
```

---

## ✅ Production Checklist

### Security
- [ ] All API keys in Azure Key Vault / secrets
- [ ] HTTPS enforced everywhere
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

### Performance
- [ ] CDN enabled for static assets
- [ ] Redis caching configured
- [ ] Database connection pooling
- [ ] Image optimization
- [ ] Gzip compression

### Monitoring
- [ ] Application Insights connected
- [ ] Health checks configured
- [ ] Alerting rules set up
- [ ] Log aggregation enabled

### Scaling
- [ ] Auto-scaling rules configured
- [ ] Min/max replicas set
- [ ] Resource limits defined
- [ ] Load testing completed

### Backup & Recovery
- [ ] Database backups scheduled
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure tested

---

## 🔧 Troubleshooting

### Container App Not Starting

```powershell
# Check logs
az containerapp logs show \
  --name gratech-backend \
  --resource-group $RG \
  --type console

# Check revisions
az containerapp revision list \
  --name gratech-backend \
  --resource-group $RG
```

### DNS Not Resolving

```powershell
# Check DNS propagation
nslookup gratech.sa
nslookup www.gratech.sa

# Verify nameservers at registrar match Azure DNS
```

### API Key Issues

```powershell
# Test Google AI
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# Test Azure AI
curl -X POST "$DEEPSEEK_ENDPOINT/openai/deployments/DeepSeek-V3.1/chat/completions?api-version=2024-12-01-preview" \
  -H "api-key: $DEEPSEEK_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

---

## 📞 Support

- **GitHub Issues**: https://github.com/GrAxOS/GraTech-Ultimate/issues
- **Documentation**: https://docs.gratech.sa
- **Email**: support@gratech.sa

---

**Built with ❤️ by Sulaiman Alshammari (@Grar00t)**
