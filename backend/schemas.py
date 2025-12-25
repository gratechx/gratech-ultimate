from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Message(BaseModel):
    role: str = Field(..., description="Role of the message sender (user, assistant, system)")
    content: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    messages: List[Message] = Field(..., description="List of messages in the conversation history")
    model: str = Field("gpt-4o", description="ID of the model to use (gpt-4o, claude-3-opus, deepseek-r1, gemini-2.0-flash)")
    temperature: float = Field(0.7, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: int = Field(4096, ge=1, description="Maximum number of tokens to generate")
    stream: bool = Field(False, description="Whether to stream the response")

class ChatResponse(BaseModel):
    content: str = Field(..., description="Generated content from the AI model")
    model: str = Field(..., description="Model that generated the response")
    tokens_used: Optional[int] = Field(None, description="Number of tokens used")

class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="The main prompt for generation")
    type: str = Field(..., description="Type of generation (code, app, image)")
    model: str = Field("gpt-4o", description="Model to use for generation")
    options: Optional[Dict[str, Any]] = Field(None, description="Additional generation options")

class GenerateResponse(BaseModel):
    content: str = Field(..., description="Generated content")
    type: str = Field(..., description="Type of generated content")
    model: str = Field(..., description="Model used")

class ModelInfo(BaseModel):
    id: str
    provider: str
    status: str
    description: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    app_name: str
    models_available: List[str]
