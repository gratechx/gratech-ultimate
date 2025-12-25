# ==========================================
# GraTech Ultimate - Architecture
# System design and technical architecture
# ==========================================

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           GraTech Ultimate                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Frontend   │  │   Backend    │  │   Extension  │                  │
│  │  React/Vite  │  │   FastAPI    │  │   Chrome     │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                  │                  │                          │
│         └──────────────────┼──────────────────┘                          │
│                            │                                             │
│  ┌─────────────────────────┴─────────────────────────┐                  │
│  │                   API Gateway                      │                  │
│  │         (FastAPI + Rate Limiting + Auth)          │                  │
│  └─────────────────────────┬─────────────────────────┘                  │
│                            │                                             │
│  ┌─────────────────────────┴─────────────────────────┐                  │
│  │              AI Model Router                       │                  │
│  │    (Intelligent routing to optimal model)         │                  │
│  └─────────────────────────┬─────────────────────────┘                  │
│                            │                                             │
│  ┌──────────┬──────────┬───┴────┬──────────┬──────────┐                │
│  │  Gemini  │ DeepSeek │ Llama  │  GPT-5   │  GPT-4o  │                │
│  │  Google  │  Azure   │ Azure  │  Azure   │  Azure   │                │
│  └──────────┴──────────┴────────┴──────────┴──────────┘                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Architecture

### Frontend (React + TypeScript)

```
src/
├── features/           # Feature modules (self-contained)
│   ├── VideoGen.tsx    # Video generation
│   ├── ImageGen.tsx    # Image generation
│   ├── TTS.tsx         # Text-to-speech
│   ├── LiveAudio.tsx   # Real-time audio
│   ├── Grounding.tsx   # Search with grounding
│   ├── Genesis.tsx     # Code generation
│   └── SuperBrain.tsx  # Multi-model chat
│
├── components/         # Reusable UI components
│   ├── ui/             # Base components (Button, Input, etc.)
│   ├── ChatMessage.tsx
│   ├── ModelSelector.tsx
│   └── Sidebar.tsx
│
├── services/           # API & external services
│   ├── geminiService.ts    # Google AI integration
│   ├── memoryService.ts    # Conversation memory
│   └── loggerService.ts    # Logging
│
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/              # Custom React hooks
│   ├── useChat.ts
│   ├── useAudio.ts
│   └── useLocalStorage.ts
│
├── types/              # TypeScript definitions
│   └── index.ts
│
└── utils/              # Utility functions
    ├── formatters.ts
    └── validators.ts
```

### Backend (FastAPI + Python)

```
backend/
├── main.py             # FastAPI application & routes
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container definition
│
├── routers/            # API route handlers
│   ├── chat.py
│   ├── image.py
│   ├── video.py
│   └── audio.py
│
├── services/           # Business logic
│   ├── ai_router.py    # Model routing logic
│   ├── google_ai.py    # Google AI client
│   └── azure_ai.py     # Azure AI client
│
├── models/             # Pydantic models
│   ├── requests.py
│   └── responses.py
│
└── utils/              # Utilities
    ├── rate_limiter.py
    └── cache.py
```

---

## 🔄 Data Flow

### Chat Request Flow

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│  User  │────▶│Frontend│────▶│Backend │────▶│AI Model│
│        │     │        │     │        │     │        │
│        │◀────│        │◀────│        │◀────│        │
└────────┘     └────────┘     └────────┘     └────────┘
     1. Input      2. API       3. Route      4. Generate
                   Request      to Model      Response
```

### Detailed Flow:

1. **User Input** → User types message in chat
2. **Frontend Processing**:
   - Validate input
   - Add to conversation history
   - Show loading state
3. **API Request**:
   - POST to `/api/chat`
   - Include message, history, model preference
4. **Backend Processing**:
   - Authenticate request
   - Check rate limits
   - Route to appropriate model
5. **AI Model**:
   - Process with selected model
   - Generate response
6. **Response**:
   - Stream back to frontend
   - Display to user
   - Save to memory

---

## 🔌 Integration Architecture

### Google AI Integration

```typescript
// geminiService.ts
class GeminiService {
  private client: GoogleAI;
  
  // Chat with Gemini models
  async chat(params: ChatParams): Promise<ChatResponse>;
  
  // Generate images with Imagen
  async generateImage(params: ImageParams): Promise<ImageResponse>;
  
  // Generate videos with Veo
  async generateVideo(params: VideoParams): Promise<VideoResponse>;
  
  // Text-to-speech
  async textToSpeech(params: TTSParams): Promise<AudioResponse>;
  
  // Live audio streaming
  async streamAudio(audioStream: MediaStream): AsyncIterator<AudioChunk>;
}
```

### Azure AI Integration

```python
# azure_ai.py
class AzureAIService:
    def __init__(self):
        self.deepseek = DeepSeekClient(endpoint, key)
        self.llama = LlamaClient(endpoint, key)
        self.gpt = OpenAIClient(endpoint, key)
    
    async def chat_deepseek(self, messages: List[Message]) -> Response
    async def chat_llama(self, messages: List[Message]) -> Response
    async def chat_gpt(self, messages: List[Message]) -> Response
```

---

## 🧠 AI Model Router

The intelligent router selects the optimal model based on query characteristics.

```python
class AIRouter:
    def route(self, query: str, preferences: dict) -> str:
        """
        Routing Logic:
        
        1. Code-related queries → DeepSeek V3
           - Regex: contains code blocks, programming terms
           
        2. Math/Logic puzzles → Llama 405B
           - Regex: mathematical expressions, logical operators
           
        3. Creative writing → GPT-5
           - Keywords: write, story, creative, poem
           
        4. Fast general queries → Gemini 2.5 Flash
           - Default for simple questions
           
        5. Complex reasoning → Gemini 3 Pro
           - Multi-step problems, analysis
        """
        
        if self.is_code_query(query):
            return "deepseek-v3"
        elif self.is_math_query(query):
            return "llama-405b"
        elif self.is_creative_query(query):
            return "gpt-5"
        elif self.is_complex_query(query):
            return "gemini-3-pro"
        else:
            return "gemini-2.5-flash"
```

---

## 💾 State Management

### Frontend State

```typescript
// Zustand store for global state
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Chat
  conversations: Conversation[];
  currentConversation: string | null;
  
  // Settings
  theme: 'light' | 'dark';
  selectedModel: AIModel;
  
  // Actions
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  sendMessage: (message: string) => Promise<void>;
  selectModel: (model: AIModel) => void;
}
```

### Memory Service

```typescript
// Long-term memory for conversations
interface MemoryService {
  // Store conversation context
  saveMemory(key: string, data: any): Promise<void>;
  
  // Retrieve relevant context
  getMemory(key: string): Promise<any>;
  
  // Semantic search through memories
  searchMemories(query: string): Promise<Memory[]>;
  
  // Summarize old conversations
  summarize(conversationId: string): Promise<string>;
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌────────┐     ┌────────┐     ┌────────┐
│  User  │────▶│  Auth  │────▶│  JWT   │
│ Login  │     │ Server │     │ Token  │
└────────┘     └────────┘     └────────┘
                    │
                    ▼
            ┌─────────────┐
            │  Protected  │
            │   Routes    │
            └─────────────┘
```

### API Security

1. **Rate Limiting**: Per-user, per-endpoint limits
2. **Input Validation**: Pydantic models for all inputs
3. **API Keys**: Encrypted storage in Azure Key Vault
4. **CORS**: Strict origin policies
5. **HTTPS**: Enforced everywhere

---

## 📊 Performance Architecture

### Caching Strategy

```
┌─────────────────────────────────────────┐
│           Cache Layers                   │
├─────────────────────────────────────────┤
│                                          │
│  L1: Browser Cache (Static Assets)       │
│         ↓                                │
│  L2: CDN Cache (Azure Front Door)        │
│         ↓                                │
│  L3: Redis Cache (API Responses)         │
│         ↓                                │
│  L4: AI Model Cache (Repeated Queries)   │
│                                          │
└─────────────────────────────────────────┘
```

### Scaling Strategy

```yaml
# Auto-scaling configuration
scaling:
  min_replicas: 1
  max_replicas: 10
  
  rules:
    - trigger: cpu
      threshold: 70%
      scale_up: 2
      
    - trigger: memory
      threshold: 80%
      scale_up: 1
      
    - trigger: requests
      threshold: 1000/min
      scale_up: 2
```

---

## 🌐 Deployment Architecture

### Azure Resources

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Subscription                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              gratech-rg (Resource Group)               │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │  │
│  │  │  Container │  │    ACR     │  │    DNS     │      │  │
│  │  │    Apps    │  │ gratechacr │  │ gratech.sa │      │  │
│  │  └────────────┘  └────────────┘  └────────────┘      │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │  │
│  │  │   Redis    │  │  Key Vault │  │  Storage   │      │  │
│  │  │   Cache    │  │            │  │  Account   │      │  │
│  │  └────────────┘  └────────────┘  └────────────┘      │  │
│  │                                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Monitoring Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Application  │  │    Azure     │  │   Custom     │      │
│  │  Insights    │  │   Monitor    │  │  Dashboard   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                   ┌────────┴────────┐                       │
│                   │   Log Analytics │                       │
│                   │    Workspace    │                       │
│                   └─────────────────┘                       │
│                                                              │
│  Metrics Collected:                                          │
│  • Request latency                                           │
│  • Error rates                                               │
│  • AI model response times                                   │
│  • User sessions                                             │
│  • Resource utilization                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Built with ❤️ by Sulaiman Alshammari (@Grar00t)**
