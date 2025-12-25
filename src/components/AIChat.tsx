import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { AppMode, Message, ChatRole as Role, MessageType, Language } from '../types';
import { sendMessage, startLiveSession, stopLiveSession } from '../services/geminiService';
import { X, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';

interface AIChatProps {
  mode: 'full' | 'popup';
  lang: Language;
  apiKey?: string;
  onOpen?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ mode, lang, onOpen }) => {
  const [isOpen, setIsOpen] = useState(mode === 'full');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      createdAt: new Date(),
      conversationId: 'init',
      role: Role.MODEL,
      text: "System initialized. How can I assist you today?",
      content: { text: "System initialized. How can I assist you today?" },
      type: MessageType.TEXT,
      status: 'read',
      context: { tokens: { prompt: 0, completion: 0, total: 0 } }
    }
  ]);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.CHAT_SMART);
  const [isThinking, setIsThinking] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // If mode changes to full, ensure it's open
  useEffect(() => {
    if (mode === 'full') setIsOpen(true);
  }, [mode]);

  const handleSendMessage = async (text: string, files: File[]) => {
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      createdAt: new Date(),
      conversationId: 'active',
      role: Role.USER,
      text: text,
      content: { text: text },
      type: MessageType.TEXT,
      status: 'sent',
      context: { tokens: { prompt: 0, completion: 0, total: 0 } },
      metadata: {
         // handle file previews conceptually
      }
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Convert files to base64 if needed
    const processedFiles: {data: string, mimeType: string}[] = [];
    for (const file of files) {
       const reader = new FileReader();
       await new Promise<void>((resolve) => {
         reader.onload = () => {
           const base64 = (reader.result as string).split(',')[1];
           processedFiles.push({ data: base64, mimeType: file.type });
           resolve();
         };
         reader.readAsDataURL(file);
       });
    }

    // Call API
    try {
      const response = await sendMessage(text, appMode, messages, processedFiles);
      setMessages(prev => [...prev, response]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        createdAt: new Date(),
        conversationId: 'error',
        role: Role.MODEL,
        text: "Error communicating with Gemini.",
        content: { text: "Error communicating with Gemini." },
        type: MessageType.TEXT,
        status: 'failed',
        context: { tokens: { prompt: 0, completion: 0, total: 0 } }
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleLive = async () => {
     if (isLiveActive) {
        await stopLiveSession();
        setIsLiveActive(false);
     } else {
        setIsLiveActive(true);
        await startLiveSession((visualizerData) => {
           // update visualizer state if we had one
        }, () => setIsLiveActive(false));
     }
  };

  if (mode === 'popup' && !isOpen) {
    return (
      <button 
        onClick={() => onOpen ? onOpen() : setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-starlight-cyan text-void-black rounded-full shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:scale-110 transition-transform z-50 animate-bounce"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  const containerClass = mode === 'full' 
    ? 'h-full w-full' 
    : 'fixed bottom-6 right-6 w-[400px] h-[600px] bg-void-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden';

  return (
    <div className={containerClass}>
      {mode === 'popup' && (
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-starlight-cyan animate-pulse"></div>
             <span className="font-header font-bold text-sm">COMET ASSISTANT</span>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={() => onOpen?.()} className="text-white/50 hover:text-white"><Maximize2 size={16} /></button>
             <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white"><X size={16} /></button>
           </div>
        </div>
      )}

      <ChatInterface 
        messages={messages}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
        currentMode={appMode}
        onModeChange={setAppMode}
        isLiveActive={isLiveActive}
        toggleLive={toggleLive}
      />
    </div>
  );
};

export default AIChat;