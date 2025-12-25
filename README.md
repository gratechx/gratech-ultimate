# 🚀 GraTech Ultimate

<div align="center">

![GraTech Banner](https://img.shields.io/badge/GraTech-Ultimate-14b8a6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+)

**Sovereign AI Platform | منصة الذكاء الاصطناعي السيادية**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)

**Built with ❤️ by [Sulaiman Alshammari](https://github.com/Grar00t) | سليمان الشمري**

[Live Demo](https://ai.gratech.sa) • [Documentation](docs/) • [API Reference](https://api.gratech.sa/docs)

</div>

---

## ✨ Overview

**GraTech Ultimate** is a sovereign AI platform that orchestrates multiple AI models (Gemini, DeepSeek, Llama, GPT) through a unified interface. Built entirely from a mobile phone during 4000+ hours of development, it represents a new paradigm in AI accessibility.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **Multi-Model AI** | DeepSeek V3, Llama 405B, GPT-5, GPT-4o, Gemini 3 Pro |
| 🎬 **Video Generation** | Veo 3.1 - Generate 720p videos from text |
| 🖼️ **Image Generation** | Imagen Pro - Create & edit images |
| 🎙️ **Live Audio** | Real-time voice conversation |
| 🔊 **Text-to-Speech** | Neural TTS with multiple voices |
| 🔍 **Grounded Search** | Google Search & Maps integration |
| 🛡️ **Disaster Recovery** | SAMA/NCA compliant DR system |
| 🏢 **Multi-Tenancy** | Enterprise tenant management |
| 🔌 **Browser Extension** | Chrome extension for quick access |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GraTech Ultimate                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Frontend  │  │   Backend   │  │  Extension  │            │
│  │  React/Vite │  │   FastAPI   │  │   Chrome    │            │
│  │  Port 3000  │  │  Port 8000  │  │   Manifest  │            │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘            │
│         │                │                                     │
│         └────────┬───────┘                                     │
│                  ▼                                             │
│  ┌───────────────────────────────────────────────────────┐    │
│  │              AI Model Gateway (Super Brain)            │    │
│  ├───────────────────────────────────────────────────────┤    │
│  │                                                        │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │    │
│  │  │ DeepSeek │ │  Llama   │ │   GPT    │ │  Gemini  │ │    │
│  │  │   V3.1   │ │  405B    │ │  4o/5    │ │  3 Pro   │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │    │
│  │                                                        │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │    │
│  │  │   Veo    │ │  Imagen  │ │   TTS    │ │   Live   │ │    │
│  │  │  Video   │ │  Image   │ │  Audio   │ │  Voice   │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │    │
│  │                                                        │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- API Keys (Google AI, Azure OpenAI)

### Installation

```bash
# Clone the repository
git clone https://github.com/GrAxOS/gratech-ultimate.git
cd gratech-ultimate

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### Environment Variables

```env
# Google AI
GOOGLE_API_KEY=your_google_api_key

# Azure AI
DEEPSEEK_KEY=your_deepseek_key
LLAMA_KEY=your_llama_key
AZURE_OPENAI_KEY=your_azure_openai_key

# Optional
REDIS_URL=redis://localhost:6379
```

### Running

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run backend

# Or with Docker
docker-compose up
```

Access the app at: http://localhost:3000

---

## 📁 Project Structure

```
gratech-ultimate/
├── src/
│   ├── features/          # Feature modules
│   │   ├── ChatBot.tsx    # Main chat interface
│   │   ├── SuperBrain.tsx # Multi-model selector
│   │   ├── LiveAudio.tsx  # Real-time voice
│   │   ├── ImageGen.tsx   # Image generation
│   │   ├── VideoGen.tsx   # Video generation
│   │   ├── TTS.tsx        # Text-to-speech
│   │   ├── Analysis.tsx   # Content analysis
│   │   ├── Grounding.tsx  # Search grounding
│   │   ├── DNSMonitor.tsx # DNS propagation
│   │   ├── DisasterRecovery.tsx  # DR controls
│   │   └── TenantManager.tsx     # Multi-tenancy
│   │
│   ├── components/        # Reusable components
│   ├── services/          # API services
│   │   ├── geminiService.ts  # Google AI client
│   │   ├── loggerService.ts  # Logging
│   │   └── memoryService.ts  # State management
│   │
│   ├── contexts/          # React contexts
│   ├── App.tsx            # Main app
│   ├── types.ts           # TypeScript types
│   └── index.css          # Global styles
│
├── backend/
│   ├── main.py            # FastAPI server
│   └── requirements.txt   # Python deps
│
├── extension/             # Chrome extension
│   ├── manifest.json
│   ├── sidebar.html
│   └── sidebar.js
│
├── docs/                  # Documentation
└── package.json
```

---

## 🤖 AI Models

### Available Models

| Model | Provider | Use Case | Max Tokens |
|-------|----------|----------|------------|
| DeepSeek V3.1 | Azure AI | High-speed reasoning | 8,192 |
| Llama 3.1 405B | Azure AI | Complex tasks | 4,096 |
| GPT-5 Preview | Azure AI | Latest GPT | 8,192 |
| GPT-4o | Azure OpenAI | Multimodal | 4,096 |
| Gemini 2.5 Flash | Google | Fast responses | 8,192 |
| Gemini 3 Pro | Google | Deep thinking | 32,768 |
| Veo 3.1 | Google | Video generation | - |
| Imagen Pro | Google | Image generation | - |

### API Usage

```typescript
// Chat request
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What is the capital of Saudi Arabia?",
    model: "deepseek-v3",
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.response); // "Riyadh (الرياض)"
```

---

## 🔌 Chrome Extension

Install the browser extension for quick AI access:

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

### Features
- 📌 Tab management with colors
- 📝 Quick notes with AI tags
- 🔗 GitHub import
- 🎨 Turquoise sidebar theme

---

## 🏛️ Enterprise Features

### Multi-Tenancy
- Isolated tenant namespaces
- Row-Level Security (RLS)
- Per-tenant encryption keys
- Azure AD integration

### Disaster Recovery
- RPO: < 5 minutes
- RTO: < 4 hours
- Geo-redundant backups
- Automated failover
- SAMA/NCA compliance

### Monitoring
- Real-time metrics
- DNS propagation tracking
- Endpoint health checks
- SLA monitoring

---

## 📊 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check & info |
| GET | `/models` | List available models |
| POST | `/api/chat` | Chat completion |
| POST | `/api/analyze` | Content analysis |
| POST | `/api/code` | Code generation |

### Chat Request

```json
{
  "message": "string",
  "model": "deepseek-v3",
  "system_prompt": "You are a helpful assistant",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

### Chat Response

```json
{
  "response": "string",
  "model": "DeepSeek V3.1",
  "provider": "azure",
  "duration_ms": 1234
}
```

---

## 🛡️ Security

- 🔐 API keys stored in environment variables
- 🔒 HTTPS enforced in production
- 🛡️ CORS configured per environment
- 🔑 Azure Key Vault integration
- 📝 Audit logging

---

## 🌍 Deployment

### Azure Container Apps

```bash
# Build image
docker build -t gratechacr.azurecr.io/gratech-ultimate:v1 .

# Push to ACR
docker push gratechacr.azurecr.io/gratech-ultimate:v1

# Deploy
az containerapp update \
  --name gratech-ultimate \
  --resource-group rg-cometx-prod \
  --image gratechacr.azurecr.io/gratech-ultimate:v1
```

### DNS Configuration

| Subdomain | Target |
|-----------|--------|
| gratech.sa | Static Web App |
| ai.gratech.sa | Container App |
| api.gratech.sa | Backend API |

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

## 👨‍💻 Author

<div align="center">

**Sulaiman Alshammari | سليمان الشمري**

[@Grar00t](https://github.com/Grar00t) • [admin@gratech.sa](mailto:admin@gratech.sa)

*Built entirely from a mobile phone during 4000+ hours of development*

---

**© 2025 GraTech.SA - All Rights Reserved**

</div>
