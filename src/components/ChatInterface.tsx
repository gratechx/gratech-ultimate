import React, { useRef, useEffect, useState } from 'react';
import { Message, ChatRole as Role, MessageType, AppMode } from '../types';
import { Send, Paperclip, X, Loader2, StopCircle, ChevronDown, Cpu, Zap, Brain, Sparkles } from 'lucide-react';

// Available AI Models
const AI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'Azure OpenAI', icon: '🧠', color: 'from-green-500 to-emerald-600' },
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'Azure OpenAI', icon: '🚀', color: 'from-green-400 to-teal-500' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', icon: '🎭', color: 'from-orange-500 to-amber-600' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', icon: '📜', color: 'from-orange-400 to-yellow-500' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', icon: '🔬', color: 'from-blue-500 to-indigo-600' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', icon: '⚡', color: 'from-purple-500 to-pink-600' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', icon: '💎', color: 'from-purple-600 to-violet-700' },
];

interface ChatInterfaceProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (text: string, files: File[], model?: string) => void;
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isLiveActive: boolean;
  toggleLive: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages, isThinking, onSendMessage, currentMode, onModeChange, isLiveActive, toggleLive
}) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Close model selector on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(e.target as Node)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && files.length === 0) || isThinking) return;
    onSendMessage(input, files, selectedModel);
    setInput('');
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const currentModelInfo = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth pb-44">
        {messages.map((msg) => (
          <div key={msg.id} className={lex flex-col \ animate-fadeIn}>
            <div className={max-w-[85%] md:max-w-[70%] p-5 rounded-2xl relative backdrop-blur-md transition-all duration-300 \}>
              {/* Media Content */}
              {msg.metadata?.mediaUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
                  {msg.type === MessageType.VIDEO ? (
                    <video src={msg.metadata.mediaUrl} controls className="w-full h-auto" />
                  ) : (
                    <img src={msg.metadata.mediaUrl} alt="Generated" className="w-full h-auto" />
                  )}
                  <a href={msg.metadata.mediaUrl} download className="block text-center text-xs py-2 bg-white/5 hover:bg-white/10 text-starlight-cyan">
                    DOWNLOAD ASSET
                  </a>
                </div>
              )}

              {/* Text Content */}
              <div className={ont-mono text-sm md:text-base whitespace-pre-wrap leading-relaxed \}>
                {msg.content?.text || msg.text}
              </div>

              {/* Grounding Info */}
              {msg.context?.grounding && (
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {[...(msg.context.grounding.groundingChunks || []), ...(msg.context.grounding.web ? [msg.context.grounding.web] : [])].map((g, i) => (
                    <a key={i} href={g.uri || g.web?.uri} target="_blank" rel="noreferrer"
                      className="text-[10px] flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10 hover:border-starlight-cyan text-starlight-cyan transition-colors">
                      <span className="w-2 h-2 rounded-full bg-starlight-cyan"></span>
                      {g.title || g.web?.title || "Source"}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-white/30 mt-2 px-2 font-mono">
              {msg.role === 'user' ? 'YOU' : msg.metadata?.model ? \ • \ TOKENS : 'AI'}
            </span>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start">
            <div className="p-4 rounded-2xl bg-transparent border border-nebula-purple/30 shadow-[0_0_15px_rgba(123,44,191,0.2)]">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-starlight-cyan animate-spin" />
                <span className="text-xs font-mono text-nebula-purple animate-pulse">
                  {currentModelInfo.icon} {currentModelInfo.name} PROCESSING...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-void-black via-void-black to-transparent">
        <div className="max-w-4xl mx-auto">

          {/* Model Selector + Mode Controls */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
            
            {/* Model Selector Dropdown */}
            <div className="relative" ref={modelSelectorRef}>
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className={lex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold font-header tracking-widest uppercase border transition-all whitespace-nowrap bg-gradient-to-r \ text-white border-white/20 shadow-lg hover:scale-105}
              >
                <span>{currentModelInfo.icon}</span>
                <span>{currentModelInfo.name}</span>
                <ChevronDown className={w-3 h-3 transition-transform \} />
              </button>

              {/* Dropdown Menu */}
              {showModelSelector && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-void-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2">
                  <div className="p-2 border-b border-white/10 text-[10px] text-white/50 font-mono">SELECT AI MODEL</div>
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                      className={w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/10 transition-all \}
                    >
                      <span className="text-lg">{model.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{model.name}</div>
                        <div className="text-[10px] text-white/50">{model.provider}</div>
                      </div>
                      {selectedModel === model.id && <Sparkles className="w-4 h-4 text-starlight-cyan" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-white/10 mx-1"></div>

            {/* Mode Buttons */}
            {[
              { id: AppMode.CHAT_SMART, label: 'SMART', icon: '🧠' },
              { id: AppMode.CHAT_FAST, label: 'FAST', icon: '⚡' },
              { id: AppMode.IMAGE_GEN, label: 'IMAGE', icon: '🎨' },
              { id: AppMode.VIDEO_GEN, label: 'VIDEO', icon: '🎥' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id as AppMode)}
                className={px-3 py-1.5 rounded text-[10px] font-bold font-header tracking-widest uppercase border transition-all whitespace-nowrap \}
              >
                {mode.icon} {mode.label}
              </button>
            ))}

            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block"></div>

            <button
              onClick={toggleLive}
              className={px-3 py-1.5 rounded text-[10px] font-bold font-header tracking-widest uppercase border transition-all whitespace-nowrap \}
            >
              {isLiveActive ? <span className="flex items-center gap-2"><StopCircle size={12} /> LIVE</span> : '🎙️ LIVE'}
            </button>
          </div>

          {/* Input Box */}
          <div className="relative group">
            <div className={bsolute -inset-0.5 bg-gradient-to-r \ rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 \}></div>
            <div className="relative flex items-end gap-2 bg-void-dark/80 backdrop-blur-xl border border-white/10 rounded-xl p-2">
              
              <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*,audio/*,.pdf,.txt,.py,.ts,.js,.json" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-white/50 hover:text-starlight-cyan transition-colors relative"
                title="Attach files (Image/Video/Audio/Code)"
                disabled={isLiveActive}
              >
                <Paperclip className="h-5 w-5" />
                {files.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-starlight-cyan text-void-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {files.length}
                  </span>
                )}
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLiveActive ? "🎙️ Listening..." : Message \...}
                disabled={isLiveActive}
                className="w-full bg-transparent border-none text-white font-mono text-sm focus:ring-0 resize-none py-3 max-h-32 disabled:opacity-50 placeholder:text-white/30"
                rows={1}
                style={{ minHeight: '44px' }}
              />

              <button
                onClick={() => handleSubmit()}
                disabled={(!input.trim() && files.length === 0) || isThinking || isLiveActive}
                className={p-3 rounded-lg bg-gradient-to-r \ text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg}
                title="Send Message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 px-1">
              {files.map((f, i) => (
                <div key={i} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-white/70 flex items-center gap-1 border border-white/5">
                  <span className="max-w-[100px] truncate">{f.name}</span>
                  <span className="text-white/30">({(f.size / 1024).toFixed(0)}KB)</span>
                  <button onClick={() => removeFile(i)} className="hover:text-red-400 transition-colors ml-1">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
