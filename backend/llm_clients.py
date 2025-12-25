from openai import AzureOpenAI
import httpx
from typing import Optional, AsyncGenerator, List, Dict, Any
from settings import Settings
import logging

logger = logging.getLogger(__name__)

class LLMClientManager:
    """Unified LLM Client Manager for all AI providers"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.azure_openai: Optional[AzureOpenAI] = None
        self._init_clients()
    
    def _init_clients(self):
        # Azure OpenAI Client
        if self.settings.AZURE_OPENAI_ENDPOINT and self.settings.AZURE_OPENAI_KEY:
            self.azure_openai = AzureOpenAI(
                azure_endpoint=self.settings.AZURE_OPENAI_ENDPOINT,
                api_key=self.settings.AZURE_OPENAI_KEY,
                api_version=self.settings.AZURE_OPENAI_API_VERSION,
            )
            logger.info("Azure OpenAI client initialized")

    async def _azure_chat(self, messages: List[Dict[str, str]], model: str, temperature: float, max_tokens: int) -> str:
        if not self.azure_openai:
            raise ValueError("Azure OpenAI client not initialized. Check AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY.")
        response = self.azure_openai.chat.completions.create(
            model=self.settings.AZURE_OPENAI_DEPLOYMENT,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content or ""

    async def _claude_chat(self, messages: List[Dict[str, str]], model: str, temperature: float, max_tokens: int) -> str:
        if not self.settings.AZURE_CLAUDE_ENDPOINT or not self.settings.AZURE_CLAUDE_KEY:
            raise ValueError("Azure Claude endpoint or key not configured.")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            headers = {
                "api-key": self.settings.AZURE_CLAUDE_KEY,
                "Content-Type": "application/json",
            }
            url = f"{self.settings.AZURE_CLAUDE_ENDPOINT.rstrip('/')}/openai/deployments/{model}/chat/completions?api-version={self.settings.AZURE_OPENAI_API_VERSION}"
            payload = {
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    
    async def _deepseek_chat(self, messages: List[Dict[str, str]], model: str, temperature: float, max_tokens: int) -> str:
        if not self.settings.AZURE_DEEPSEEK_ENDPOINT or not self.settings.AZURE_DEEPSEEK_KEY:
            raise ValueError("Azure DeepSeek endpoint or key not configured.")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            headers = {
                "api-key": self.settings.AZURE_DEEPSEEK_KEY,
                "Content-Type": "application/json",
            }
            url = f"{self.settings.AZURE_DEEPSEEK_ENDPOINT.rstrip('/')}/openai/deployments/{model}/chat/completions?api-version={self.settings.AZURE_OPENAI_API_VERSION}"
            payload = {
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def _gemini_chat(self, messages: List[Dict[str, str]], model: str, temperature: float, max_tokens: int) -> str:
        if not self.settings.GEMINI_API_KEY:
            raise ValueError("Google Gemini API key not configured.")
        
        import google.generativeai as genai
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel(model or 'gemini-2.0-flash')
        
        gemini_contents = []
        for msg in messages:
            if msg['role'] == 'user':
                gemini_contents.append({'role': 'user', 'parts': [{'text': msg['content']}]})
            elif msg['role'] == 'assistant':
                gemini_contents.append({'role': 'model', 'parts': [{'text': msg['content']}]})
            elif msg['role'] == 'system':
                gemini_contents.insert(0, {'role': 'user', 'parts': [{'text': f"System: {msg['content']}"}]})

        response = gemini_model.generate_content(
            gemini_contents,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
        )
        return response.text if response.parts else ""

    async def chat(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> str:
        """Route chat request to appropriate provider"""
        model_lower = model.lower()
        
        if "gpt" in model_lower:
            return await self._azure_chat(messages, model, temperature, max_tokens)
        elif "claude" in model_lower:
            return await self._claude_chat(messages, model, temperature, max_tokens)
        elif "deepseek" in model_lower:
            return await self._deepseek_chat(messages, model, temperature, max_tokens)
        elif "gemini" in model_lower:
            return await self._gemini_chat(messages, model, temperature, max_tokens)
        else:
            # Default to Azure OpenAI
            return await self._azure_chat(messages, model, temperature, max_tokens)
    
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> AsyncGenerator[str, None]:
        """Stream chat response from Azure OpenAI"""
        if not self.azure_openai:
            raise ValueError("Azure OpenAI client not initialized.")
        
        response_stream = self.azure_openai.chat.completions.create(
            model=self.settings.AZURE_OPENAI_DEPLOYMENT,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True
        )
        for chunk in response_stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def embed(self, text: str, model: str = "text-embedding-ada-002") -> List[float]:
        """Generate embeddings using Azure OpenAI"""
        if not self.azure_openai:
            raise ValueError("Azure OpenAI client not initialized for embeddings.")
        response = self.azure_openai.embeddings.create(
            input=text,
            model=model
        )
        return response.data[0].embedding
