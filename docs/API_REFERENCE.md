# ==========================================
# GraTech Ultimate API Reference
# Complete documentation for all endpoints
# ==========================================

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.gratech.sa`

## Authentication

All AI endpoints require API keys passed via headers:

```http
X-Google-API-Key: your_google_api_key
X-Azure-API-Key: your_azure_api_key
```

---

## 🤖 Chat Endpoints

### POST /api/chat

Universal chat endpoint supporting multiple AI models.

**Request Body:**
```json
{
  "message": "string",
  "model": "gemini-2.5-flash | gemini-3-pro | deepseek-v3 | llama-405b | gpt-5 | gpt-4o",
  "history": [
    {"role": "user", "content": "string"},
    {"role": "assistant", "content": "string"}
  ],
  "temperature": 0.7,
  "max_tokens": 8192,
  "system_prompt": "optional system prompt"
}
```

**Response:**
```json
{
  "response": "AI generated response",
  "model": "model_used",
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 500,
    "total_tokens": 600
  },
  "latency_ms": 1234
}
```

**Model Routing:**
| Model | Provider | Best For |
|-------|----------|----------|
| gemini-2.5-flash | Google | Fast responses, general tasks |
| gemini-3-pro | Google | Complex reasoning |
| deepseek-v3 | Azure AI | Code, math, analysis |
| llama-405b | Azure AI | Long context, reasoning |
| gpt-5 | Azure AI | Advanced tasks |
| gpt-4o | Azure OpenAI | Balanced performance |

---

## 🖼️ Image Generation

### POST /api/image/generate

Generate images using Imagen Pro.

**Request Body:**
```json
{
  "prompt": "A futuristic Saudi cityscape at sunset",
  "negative_prompt": "blurry, low quality",
  "width": 1024,
  "height": 1024,
  "num_images": 1,
  "style": "photorealistic | artistic | anime"
}
```

**Response:**
```json
{
  "images": [
    {
      "base64": "base64_encoded_image",
      "url": "temporary_url",
      "seed": 12345
    }
  ],
  "prompt_used": "enhanced prompt"
}
```

---

## 🎬 Video Generation

### POST /api/video/generate

Generate videos using Veo 3.1.

**Request Body:**
```json
{
  "prompt": "A rocket launching from Saudi desert",
  "duration": 10,
  "fps": 24,
  "resolution": "1080p | 4k",
  "aspect_ratio": "16:9 | 9:16 | 1:1"
}
```

**Response:**
```json
{
  "video_url": "url_to_generated_video",
  "duration_seconds": 10,
  "status": "completed"
}
```

### POST /api/video/extend

Extend existing video.

**Request Body:**
```json
{
  "video_url": "source_video_url",
  "prompt": "Continue the scene with...",
  "extend_seconds": 5
}
```

---

## 🔊 Text-to-Speech

### POST /api/tts/generate

Convert text to speech.

**Request Body:**
```json
{
  "text": "مرحباً بكم في جراتك",
  "voice": "ar-SA-ZariyahNeural | ar-SA-HamedNeural",
  "speed": 1.0,
  "pitch": 0,
  "format": "mp3 | wav | ogg"
}
```

**Response:**
```json
{
  "audio_url": "url_to_audio",
  "duration_seconds": 5.2,
  "format": "mp3"
}
```

### Available Voices (Arabic):
- `ar-SA-ZariyahNeural` - Female, Saudi
- `ar-SA-HamedNeural` - Male, Saudi
- `ar-AE-FatimaNeural` - Female, UAE
- `ar-EG-SalmaNeural` - Female, Egyptian

---

## 🎙️ Live Audio

### WebSocket /api/audio/stream

Real-time audio streaming with Gemini Live.

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8000/api/audio/stream');

ws.onopen = () => {
  // Start sending audio chunks
  ws.send(audioChunk); // ArrayBuffer
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  // response.audio = base64 audio
  // response.text = transcription
};
```

**Message Types:**
```json
// Client -> Server
{
  "type": "audio",
  "data": "base64_audio_chunk"
}

// Server -> Client  
{
  "type": "response",
  "audio": "base64_audio_response",
  "text": "transcribed_and_response_text"
}
```

---

## 🔍 Grounding Search

### POST /api/search/grounded

Search with AI grounding and citations.

**Request Body:**
```json
{
  "query": "Latest news about Saudi Vision 2030",
  "include_citations": true,
  "search_depth": "basic | deep"
}
```

**Response:**
```json
{
  "answer": "AI generated answer with facts",
  "citations": [
    {
      "title": "Source Title",
      "url": "https://source.com",
      "snippet": "Relevant excerpt..."
    }
  ],
  "confidence": 0.95
}
```

---

## 📊 Model Information

### GET /api/models

List available models and their status.

**Response:**
```json
{
  "models": [
    {
      "id": "gemini-2.5-flash",
      "provider": "google",
      "status": "available",
      "capabilities": ["chat", "code", "analysis"],
      "context_window": 1000000,
      "rate_limit": "60/min"
    }
  ]
}
```

### GET /api/models/{model_id}/status

Check specific model status.

---

## 🏥 Health & Monitoring

### GET /health

Basic health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-28T10:00:00Z"
}
```

### GET /api/health/detailed

Detailed health with all services.

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "google_ai": "connected",
    "azure_ai": "connected",
    "redis": "connected"
  },
  "uptime_seconds": 86400,
  "version": "1.0.0"
}
```

---

## 🔧 Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

**Common Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Bad request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `RATE_LIMITED` | 429 | Too many requests |
| `MODEL_UNAVAILABLE` | 503 | AI model temporarily down |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📈 Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/chat | 60 | 1 minute |
| /api/image/generate | 10 | 1 minute |
| /api/video/generate | 5 | 1 minute |
| /api/tts/generate | 30 | 1 minute |

---

## 🔗 SDK Examples

### JavaScript/TypeScript
```typescript
import { GraTechClient } from '@gratech/sdk';

const client = new GraTechClient({
  apiKey: process.env.GRATECH_API_KEY
});

// Chat
const response = await client.chat({
  message: "Hello!",
  model: "gemini-2.5-flash"
});

// Generate Image
const image = await client.generateImage({
  prompt: "Beautiful desert sunset"
});
```

### Python
```python
from gratech import GraTechClient

client = GraTechClient(api_key="your_key")

# Chat
response = client.chat(
    message="Hello!",
    model="gemini-2.5-flash"
)

# Generate Image
image = client.generate_image(
    prompt="Beautiful desert sunset"
)
```

---

## 📞 Support

- **Documentation**: https://docs.gratech.sa
- **GitHub**: https://github.com/GrAxOS
- **Email**: support@gratech.sa
