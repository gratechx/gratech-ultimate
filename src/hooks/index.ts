// ============================================
// GraTech Ultimate - Custom React Hooks
// Reusable hooks for AI interactions
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { geminiService, GeminiModel, ChatMessage } from '../services/geminiService';
import { memoryService } from '../services/memoryService';

// ==========================================
// useChat - Chat with AI models
// ==========================================
interface UseChatOptions {
  model?: GeminiModel;
  conversationId?: string;
  systemPrompt?: string;
  enableMemory?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setModel: (model: GeminiModel) => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    model: initialModel = 'gemini-2.5-flash',
    conversationId = 'default',
    systemPrompt,
    enableMemory = true,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [model, setModel] = useState<GeminiModel>(initialModel);

  // Load conversation history on mount
  useEffect(() => {
    if (enableMemory) {
      const context = memoryService.getContext(conversationId);
      if (context) {
        setMessages(context.messages.map(m => ({
          role: m.role,
          content: m.content,
        })));
      }
    }
  }, [conversationId, enableMemory]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Add to memory
      if (enableMemory) {
        await memoryService.addToContext(conversationId, 'user', content);
      }

      // Send to AI
      const response = await geminiService.chat({
        model,
        message: content,
        history: messages,
        systemPrompt,
      });

      const assistantMessage: ChatMessage = { role: 'model', content: response.text };
      setMessages(prev => [...prev, assistantMessage]);

      // Save response to memory
      if (enableMemory) {
        await memoryService.addToContext(conversationId, 'assistant', response.text);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Chat failed'));
    } finally {
      setIsLoading(false);
    }
  }, [model, messages, conversationId, systemPrompt, enableMemory]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setModel,
  };
}

// ==========================================
// useAudio - Audio recording and playback
// ==========================================
interface UseAudioReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  playAudio: (url: string) => void;
  stopAudio: () => void;
  error: Error | null;
}

export function useAudio(): UseAudioReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start recording'));
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);

        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const playAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(url);
    audioRef.current.play();
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    playAudio,
    stopAudio,
    error,
  };
}

// ==========================================
// useLocalStorage - Persistent state
// ==========================================
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// ==========================================
// useDebounce - Debounced value
// ==========================================
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ==========================================
// useAsync - Async operation handling
// ==========================================
interface UseAsyncReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
}

export function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Async operation failed'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  return { data, isLoading, error, execute };
}

// ==========================================
// useMediaQuery - Responsive design
// ==========================================
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ==========================================
// useClipboard - Clipboard operations
// ==========================================
interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  paste: () => Promise<string | null>;
  isCopied: boolean;
}

export function useClipboard(resetDelay = 2000): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetDelay);
      return true;
    } catch {
      return false;
    }
  }, [resetDelay]);

  const paste = useCallback(async (): Promise<string | null> => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }, []);

  return { copy, paste, isCopied };
}

// ==========================================
// useKeyPress - Keyboard shortcuts
// ==========================================
export function useKeyPress(targetKey: string, callback: () => void, modifiers?: {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const ctrlMatch = modifiers?.ctrl ? event.ctrlKey : true;
      const shiftMatch = modifiers?.shift ? event.shiftKey : true;
      const altMatch = modifiers?.alt ? event.altKey : true;

      if (event.key === targetKey && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [targetKey, callback, modifiers]);
}

// ==========================================
// useOnlineStatus - Network status
// ==========================================
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
