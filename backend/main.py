from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from settings import get_settings
from llm_clients import LLMClientManager
from router import router
from schemas import HealthResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("=" * 50)
    logger.info("🚀 GraTech AI Nexus Backend Starting...")
    logger.info(f"📦 App: {settings.APP_NAME}")
    logger.info(f"🔗 Azure OpenAI: {settings.AZURE_OPENAI_ENDPOINT[:30]}..." if settings.AZURE_OPENAI_ENDPOINT else "⚠️ Azure OpenAI not configured")
    logger.info(f"🔗 Azure Claude: {settings.AZURE_CLAUDE_ENDPOINT[:30]}..." if settings.AZURE_CLAUDE_ENDPOINT else "⚠️ Azure Claude not configured")
    logger.info(f"🔗 Azure DeepSeek: {settings.AZURE_DEEPSEEK_ENDPOINT[:30]}..." if settings.AZURE_DEEPSEEK_ENDPOINT else "⚠️ Azure DeepSeek not configured")
    logger.info(f"🔗 Gemini: {'Configured' if settings.GEMINI_API_KEY else 'Not configured'}")
    logger.info("=" * 50)
    
    app.state.llm_manager = LLMClientManager(settings)
    logger.info("✅ LLM Client Manager initialized")
    yield
    # Shutdown
    logger.info("👋 GraTech AI Nexus Backend shutting down...")

app = FastAPI(
    title="GraTech AI Nexus API",
    description="Sovereign AI Infrastructure Backend - Multi-Model Gateway",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router, prefix="/api/v1", tags=["AI"])

@app.get("/", summary="Root endpoint")
async def root():
    return {
        "name": settings.APP_NAME,
        "status": "online",
        "version": "2.0.0",
        "docs": "/docs",
        "endpoints": {
            "chat": "/api/v1/chat",
            "stream": "/api/v1/chat/stream",
            "models": "/api/v1/models",
            "generate_code": "/api/v1/generate/code",
            "generate_app": "/api/v1/generate/app"
        }
    }

@app.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check():
    return HealthResponse(
        status="healthy",
        version="2.0.0",
        app_name=settings.APP_NAME,
        models_available=["gpt-4o", "claude-3-opus", "deepseek-r1", "gemini-2.0-flash"]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
