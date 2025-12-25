from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List
import json

class Settings(BaseSettings):
    # Azure OpenAI (GPT-4o, GPT-4.1)
    AZURE_OPENAI_ENDPOINT: str = ""
    AZURE_OPENAI_KEY: str = ""
    AZURE_OPENAI_DEPLOYMENT: str = "gpt-4o"
    AZURE_OPENAI_API_VERSION: str = "2024-02-15-preview"
    
    # Azure Claude (Sonnet/Opus)
    AZURE_CLAUDE_ENDPOINT: str = ""
    AZURE_CLAUDE_KEY: str = ""
    
    # Azure DeepSeek (R1)
    AZURE_DEEPSEEK_ENDPOINT: str = ""
    AZURE_DEEPSEEK_KEY: str = ""
    
    # Google Gemini
    GEMINI_API_KEY: str = ""
    
    # App Settings
    APP_NAME: str = "GraTech AI Nexus"
    DEBUG: bool = False
    CORS_ORIGINS: str = '["http://localhost:5173", "https://ai.gratech.sa"]'
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Caching
    CACHE_TTL: int = 3600
    
    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except:
            return ["http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
