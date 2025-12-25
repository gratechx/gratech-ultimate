from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from schemas import ChatRequest, ChatResponse, GenerateRequest, GenerateResponse, ModelInfo
from settings import get_settings, Settings
from llm_clients import LLMClientManager
from typing import List
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_llm_manager(request: Request) -> LLMClientManager:
    return request.app.state.llm_manager

@router.post("/chat", response_model=ChatResponse, summary="Chat with AI models")
async def chat_endpoint(request: ChatRequest, llm_manager: LLMClientManager = Depends(get_llm_manager)):
    """Send a chat message to AI model (GPT-4o, Claude, DeepSeek, or Gemini)"""
    try:
        logger.info(f"Chat request: model={request.model}, messages={len(request.messages)}")
        response_content = await llm_manager.chat(
            messages=[{"role": m.role, "content": m.content} for m in request.messages],
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return ChatResponse(content=response_content, model=request.model)
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")

@router.post("/chat/stream", summary="Stream chat with AI models")
async def stream_chat_endpoint(request: ChatRequest, llm_manager: LLMClientManager = Depends(get_llm_manager)):
    """Stream chat response from AI model"""
    try:
        async def generate_stream():
            async for chunk in llm_manager.stream_chat(
                messages=[{"role": m.role, "content": m.content} for m in request.messages],
                model=request.model,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(generate_stream(), media_type="text/event-stream")
    except Exception as e:
        logger.error(f"Stream error: {e}")
        raise HTTPException(status_code=500, detail=f"Stream Error: {str(e)}")

@router.post("/generate/code", response_model=GenerateResponse, summary="Generate code")
async def generate_code_endpoint(request: GenerateRequest, llm_manager: LLMClientManager = Depends(get_llm_manager)):
    """Generate code using AI"""
    language = request.options.get('language', 'Python') if request.options else 'Python'
    full_prompt = f"Write clean, production-ready {language} code for: {request.prompt}. Include comments and best practices."
    try:
        code = await llm_manager.chat(
            messages=[{"role": "user", "content": full_prompt}],
            model=request.model,
            temperature=0.3
        )
        return GenerateResponse(content=code, type="code", model=request.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code Generation Error: {str(e)}")

@router.post("/generate/app", summary="Generate full application")
async def generate_app_endpoint(request: GenerateRequest, llm_manager: LLMClientManager = Depends(get_llm_manager)):
    """Trigger App Factory to generate full application"""
    try:
        plan_prompt = f"Create a detailed technical plan for: {request.prompt}. Include architecture, database schema, API endpoints, and frontend components."
        plan = await llm_manager.chat(
            messages=[{"role": "user", "content": plan_prompt}],
            model=request.model,
            temperature=0.5
        )
        return {"status": "success", "plan": plan, "message": "App generation plan created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"App Generation Error: {str(e)}")

@router.get("/models", response_model=List[ModelInfo], summary="List available models")
async def list_models_endpoint():
    """Returns list of available AI models"""
    return [
        ModelInfo(id="gpt-4o", provider="azure", status="active", description="Azure OpenAI GPT-4o"),
        ModelInfo(id="gpt-4.1", provider="azure", status="active", description="Azure OpenAI GPT-4.1"),
        ModelInfo(id="claude-3-opus", provider="azure", status="active", description="Anthropic Claude 3 Opus"),
        ModelInfo(id="claude-3-sonnet", provider="azure", status="active", description="Anthropic Claude 3 Sonnet"),
        ModelInfo(id="deepseek-r1", provider="azure", status="active", description="DeepSeek R1 Reasoning"),
        ModelInfo(id="gemini-2.0-flash", provider="google", status="active", description="Google Gemini 2.0 Flash"),
        ModelInfo(id="gemini-2.5-pro", provider="google", status="active", description="Google Gemini 2.5 Pro"),
    ]
