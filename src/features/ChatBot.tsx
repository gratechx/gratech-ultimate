import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ModelType, MemoryItem, MessageType, ChatRole } from '../types';
import ChatMessage from '../components/ChatMessage';
import { generateText, generateImage } from '../services/geminiService';
import { memoryService } from '../services/memoryService';
import { Send, Zap, Brain, Sparkles, Cpu, History, Paperclip, X, Image as ImageIcon, Trash2, Database, Shield, RotateCcw } from 'lucide-react';

const ChatBot: React.FC = () => {
  const INITIAL_MESSAGE: Message = {
      id: 'welcome',
      createdAt: new Date(),
      conversationId: 'conv-init',
      role: 'assistant',
      text: "🌌 **Nexus Online.**\n\nSystem Status: **SECURE (Sovereign Cloud)**\n- **Azure Key Vault:** Active (CSI Driver) 🔐\n- **Workload Identity:** Federated ✅\n- **PostgreSQL:** Private Endpoint 🛡️\n\nI am ready to execute the sovereign deployment or manage secrets. How shall we proceed, Commander?",
      content: {
          text: "🌌 **Nexus Online.**\n\nSystem Status: **SECURE (Sovereign Cloud)**\n- **Azure Key Vault:** Active (CSI Driver) 🔐\n- **Workload Identity:** Federated ✅\n- **PostgreSQL:** Private Endpoint 🛡️\n\nI am ready to execute the sovereign deployment or manage secrets. How shall we proceed, Commander?"
      },
      context: {
          tokens: { prompt: 0, completion: 0, total: 0 },
          model: 'gemini-3-pro-preview'
      },
      modelUsed: 'gemini-3-pro-preview',
      status: 'read'
  };

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<ModelType>('smart');
  const [attachment, setAttachment] = useState<{file: File, preview: string} | null>(null);
  
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [showMemory, setShowMemory] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
    // Load persistent memories on mount
    setMemories(memoryService.load());
  }, []);

  // Intelligent Memory Extraction
  const extractMemory = (text: string) => {
    const lower = text.toLowerCase();
    
    // 1. Identity (FACT)
    const identityMatch = lower.match(/(?:my name is|i am|call me) ([\w\s]+)/);
    if (identityMatch && identityMatch[1]) {
        addMemory('FACT', `User Identity: ${identityMatch[1].trim()}`);
    }

    // 2. Role/Job (FACT)
    const roleMatch = lower.match(/(?:i work as|my role is|i am a) ([\w\s]+)/);
    if (roleMatch && roleMatch[1]) {
        addMemory('FACT', `User Role: ${roleMatch[1].trim()}`);
    }

    // 3. Preferences (PREF)
    if (lower.includes("i prefer") || lower.includes("i like") || lower.includes("always use") || lower.includes("don't use")) {
        // Simple extraction of the whole sentence for context
        addMemory('PREF', `Preference: ${text}`);
    }

    // 4. Tasks/Goals (TASK)
    if (lower.includes("remind me") || lower.includes("my goal is") || lower.includes("i need to")) {
        addMemory('TASK', `Objective: ${text}`);
    }
    
    // 5. Ministry/Gov Context (FACT - Saudi Specific)
    const govMatch = text.match(/(?:Ministry|Authority|Commission|وزارة|هيئة) (?:of )?([\w\s]+)/i);
    if (govMatch) {
        addMemory('FACT', `Gov Context: ${govMatch[0]}`);
    }
  };

  const addMemory = (category: 'FACT' | 'PREF' | 'TASK', content: string) => {
    const newMem = memoryService.add(category, content);
    setMemories(prev => [newMem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
      const updated = memoryService.delete(id);
      setMemories(updated);
  };

  const handleClearMemory = () => {
      if (window.confirm("Are you sure you want to purge all long-term memory? This cannot be undone.")) {
          const updated = memoryService.clear();
          setMemories(updated);
      }
  };

  const handleClearChat = () => {
      setMessages([INITIAL_MESSAGE]);
  };

  const getModelConfig = useCallback((type: ModelType) => {
    const configs = {
      fast: { model: 'gemini-2.5-flash-lite-latest', name: 'Flash Lite', icon: Zap, color: 'secondary' },
      standard: { model: 'gemini-2.5-flash', name: 'Standard', icon: Sparkles, color: 'primary' },
      smart: { model: 'gemini-3-pro-preview', name: 'Nexus Pro', icon: Brain, color: 'primary' }
    };
    return configs[type];
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAttachment({
            file,
            preview: ev.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || loading) return;

    const inputText = input.trim();
    
    // Extract context before sending
    extractMemory(inputText);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      conversationId: 'active-session',
      role: 'user',
      text: inputText,
      content: { text: inputText },
      image: attachment?.preview,
      status: 'sent',
      context: { tokens: { prompt: 0, completion: 0, total: 0 } }
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentAttachment = attachment;
    clearAttachment();
    
    // Command Handling
    if (inputText.startsWith('/image')) {
        setLoading(true);
        const prompt = inputText.replace('/image', '').trim();
        try {
            const images = await generateImage(prompt, '1:1', '1K');
            setMessages(prev => [...prev, {
                id: `img-${Date.now()}`,
                createdAt: new Date(),
                conversationId: 'active-session',
                role: 'assistant',
                text: `Visualization generated: ${prompt}`,
                content: { text: `Visualization generated: ${prompt}` },
                image: images[0],
                status: 'delivered',
                context: { tokens: { prompt: 0, completion: 0, total: 0 } }
            }]);
        } catch (e) {
             setMessages(prev => [...prev, { 
                 id: Date.now().toString(), 
                 createdAt: new Date(),
                 conversationId: 'error',
                 role: 'assistant', 
                 text: 'Visual synthesis failed.', 
                 content: { text: 'Visual synthesis failed.' },
                 status: 'failed',
                 context: { tokens: { prompt: 0, completion: 0, total: 0 } }
             }]);
        }
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
      const modelConfig = getModelConfig(modelType);
      
      // Inject Memory Context
      const memoryContextString = memoryService.getContextString(15);
      
      const enhancedPromptText = `
      [SYSTEM: ACTIVE MEMORY CONTEXT]
      ${memoryContextString}
      
      [USER QUERY]
      ${userMsg.text}`;

      let promptData: any = enhancedPromptText;

      if (currentAttachment) {
        const base64Data = currentAttachment.preview.split(',')[1];
        promptData = [
            {
                inlineData: {
                    mimeType: currentAttachment.file.type,
                    data: base64Data
                }
            },
            { text: enhancedPromptText }
        ];
      }

      const response = await generateText(promptData, modelConfig.model, {
        temperature: modelType === 'smart' ? 0.4 : 0.7,
        thinkingBudget: modelType === 'smart' ? 2048 : undefined
      });

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        createdAt: new Date(),
        conversationId: 'active-session',
        role: 'assistant',
        text: response,
        content: { text: response },
        isThinking: modelType === 'smart',
        modelUsed: modelConfig.model,
        status: 'delivered',
        context: {
            tokens: { prompt: 0, completion: 0, total: 0 },
            model: modelConfig.model
        }
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
          id: `err-${Date.now()}`,
          createdAt: new Date(),
          conversationId: 'error',
          role: 'assistant',
          text: "Connection instability detected. Retrying downlink...",
          content: { text: "Connection instability detected. Retrying downlink..." },
          status: 'failed',
          context: { tokens: { prompt: 0, completion: 0, total: 0 } }
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full text-white font-sans relative">
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-nexus-border flex items-center justify-between px-6 bg-nexus-surface/30 backdrop-blur-sm z-10">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-nexus-primary/20 rounded-lg text-nexus-primary">
                    <Brain size={18} />
                </div>
                <div>
                    <h2 className="font-bold text-sm tracking-wide">NEXUS INTELLIGENCE</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-[10px] text-nexus-gray-400 font-mono">ONLINE // {getModelConfig(modelType).name}</span>
                    </div>
                </div>
            </div>

            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                {(['fast', 'standard', 'smart'] as ModelType[]).map((t) => {
                    const conf = getModelConfig(t);
                    return (
                        <button
                            key={t}
                            onClick={() => setModelType(t)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                                modelType === t 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <conf.icon size={12} />
                            {conf.name}
                        </button>
                    )
                })}
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleClearChat}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Clear Conversation"
                >
                    <RotateCcw size={16} />
                </button>
                <button 
                    onClick={() => setShowMemory(!showMemory)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${showMemory ? 'text-nexus-secondary bg-nexus-secondary/10 border border-nexus-secondary/20' : 'text-gray-500 hover:text-white'}`}
                >
                    <Database size={16} />
                    <span className="hidden md:inline">CONTEXT</span>
                </button>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {messages.map((message, index) => (
            <ChatMessage 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1}
            />
            ))}
            {loading && (
                <div className="flex items-center gap-3 text-nexus-primary p-4 animate-pulse">
                    <div className="w-2 h-2 bg-nexus-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-nexus-primary rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-nexus-primary rounded-full animation-delay-400"></div>
                    <span className="text-xs font-mono text-nexus-primary/70">COMPUTING</span>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2">
            <div className="relative bg-nexus-surface/50 border border-nexus-border rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transition-all focus-within:border-nexus-primary/50 focus-within:ring-1 focus-within:ring-nexus-primary/20">
                {attachment && (
                    <div className="px-5 pt-4 pb-2 flex items-start gap-3">
                        <div className="relative group">
                            <img src={attachment.preview} alt="Attachment" className="h-16 w-16 object-cover rounded-lg border border-slate-600" />
                            <button 
                                onClick={clearAttachment}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            <p className="font-medium text-white">{attachment.file.name}</p>
                            <p>{(attachment.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                )}
                
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Input directive, query, or update context..."
                    className="w-full bg-transparent border-none text-white px-5 py-4 focus:outline-none placeholder-gray-600 resize-none h-14 max-h-32"
                    rows={1}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 transition-colors rounded-lg hover:bg-white/5 ${attachment ? 'text-nexus-primary' : 'text-gray-500 hover:text-white'}`}
                        title="Attach Image"
                    >
                        {attachment ? <ImageIcon size={18} /> : <Paperclip size={18} />}
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={(!input.trim() && !attachment) || loading}
                        className="p-2 bg-nexus-primary text-white rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
            <div className="text-center mt-2 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono">
                <Shield size={10} /> NEXUS OS v2.4 // POWERED BY GEMINI 3 PRO // SECURE LINK
            </div>
        </div>
      </div>

      {/* Memory Sidebar */}
      <div className={`w-80 border-l border-nexus-border bg-nexus-surface/20 backdrop-blur-xl transition-all duration-300 flex flex-col ${showMemory ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
         <div className="p-4 border-b border-nexus-border flex items-center justify-between">
             <div className="flex items-center gap-2 text-nexus-secondary">
                 <History size={16} />
                 <span className="font-bold text-xs tracking-wider">ACTIVE MEMORY</span>
             </div>
             {memories.length > 0 && (
                 <button onClick={handleClearMemory} className="text-gray-500 hover:text-red-400" title="Purge Memory">
                     <Trash2 size={14} />
                 </button>
             )}
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             {memories.length === 0 ? (
                 <div className="text-center text-gray-600 text-xs mt-10 flex flex-col items-center gap-2">
                     <Database size={24} className="opacity-20" />
                     No persistent context found.<br/>
                     Teach me facts or preferences.
                 </div>
             ) : (
                 <div className="space-y-3">
                     {memories.map((mem) => (
                         <div key={mem.id} className="bg-black/40 border border-white/5 p-3 rounded-lg hover:border-nexus-primary/30 transition-all group animate-in slide-in-from-right-2">
                             <div className="flex justify-between items-start mb-2">
                                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                     mem.category === 'FACT' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 
                                     mem.category === 'PREF' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/20' : 
                                     'bg-orange-500/20 text-orange-400 border border-orange-500/20'
                                 }`}>
                                     {mem.category}
                                 </span>
                                 <button 
                                    onClick={() => handleDeleteMemory(mem.id)} 
                                    className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <X size={12} />
                                 </button>
                             </div>
                             <p className="text-xs text-gray-300 leading-relaxed font-mono break-words">{mem.content}</p>
                             <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-gray-600 font-mono text-right">
                                 {new Date(mem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
         </div>
         
         <div className="p-4 border-t border-nexus-border bg-black/20">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] text-gray-500 font-bold">MEMORY HEALTH</span>
                 <span className="text-[10px] text-green-400">OPTIMAL</span>
             </div>
             <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-nexus-secondary to-nexus-primary transition-all duration-1000"
                    style={{ width: `${Math.min(100, (memories.length / 50) * 100)}%` }}
                 ></div>
             </div>
             <div className="text-[9px] text-gray-600 mt-1 text-right">
                 {memories.length} / 50 Slots Used
             </div>
         </div>
      </div>

    </div>
  );
};

export default ChatBot;