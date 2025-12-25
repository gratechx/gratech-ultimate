import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Bot, Sparkles, Clock, Copy, CheckCircle, Maximize2, Terminal } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest = false }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (date: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      className={`group relative transition-all duration-300 ease-in-out
        ${isLatest ? 'animate-in fade-in' : ''}
        ${isUser ? 'bg-transparent' : 'bg-slate-900/40 backdrop-blur-sm border-y border-slate-800/50'}
      `}
      role="article" 
      aria-label={`${isUser ? 'User' : 'AI Assistant'} message`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 p-6">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border transition-all duration-300 relative
            ${isUser 
              ? 'bg-slate-800 border-slate-700 text-gray-300 group-hover:border-slate-600' 
              : 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary group-hover:border-nexus-primary/50'
            }`}
          >
            {isUser ? <User size={20} /> : <Bot size={20} />}
            
            {!isUser && isLatest && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`font-bold text-sm tracking-wide flex items-center gap-2
                ${isUser ? 'text-gray-300' : 'text-nexus-primary'}`}
              >
                {isUser ? 'YOU' : 'NEXUS AI'}
                {message.modelUsed && (
                  <span className="text-xs font-mono bg-slate-800/50 px-2 py-0.5 rounded text-nexus-gray-400">
                    {message.modelUsed.includes('flash-lite') ? 'Flash Lite' : 
                     message.modelUsed.includes('pro') ? 'Pro' : 'Standard'}
                  </span>
                )}
              </span>
              
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                <Clock size={10} />
                {formatTime(message.createdAt)}
              </span>
              
              {!isUser && message.isThinking && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20 font-medium">
                  <Sparkles size={10} /> REASONING MODE
                </span>
              )}
              
              <button
                onClick={() => copyToClipboard(message.content.text)}
                className={`ml-auto p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100
                  ${copied 
                    ? 'text-green-400 bg-green-500/10' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'
                  }`}
                title={copied ? "Copied!" : "Copy message"}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
            </div>
            
            <div className={`flex flex-col md:flex-row gap-4 ${isUser ? 'items-start' : ''}`}>
              {/* Image Thumbnail for User Messages */}
              {message.image && isUser && (
                <div 
                  className="relative group/image flex-shrink-0 cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className={`rounded-lg overflow-hidden border border-slate-700 shadow-lg transition-all duration-300 ${isExpanded ? 'w-full max-w-2xl' : 'w-24 h-24'}`}>
                    <img 
                      src={message.image} 
                      alt="Attached content" 
                      className={`object-cover w-full h-full ${isExpanded ? 'object-contain max-h-[500px]' : ''}`}
                    />
                  </div>
                  {!isExpanded && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg">
                      <Maximize2 size={16} className="text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
              )}

              <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed flex-1">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-nexus-primary">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2 text-nexus-secondary">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1 text-nexus-accent">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-7">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-6">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-100">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-nexus-primary/50 pl-4 my-3 italic text-gray-400 bg-slate-900/30 py-2 pr-2 rounded-r">{children}</blockquote>,
                    a: ({ children, href }) => <a href={href} className="text-nexus-secondary hover:text-nexus-primary underline transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                    // Advanced Code Block Rendering
                    pre: ({children}) => <>{children}</>,
                    code: ({node, inline, className, children, ...props}: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeText = String(children).replace(/\n$/, '');
                      
                      if (!inline && match) {
                        return (
                          <div className="relative my-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shadow-lg group/code">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800">
                               <div className="flex items-center gap-2">
                                  <Terminal size={12} className="text-gray-500" />
                                  <span className="text-xs text-gray-400 font-mono font-bold uppercase tracking-wider">{match[1]}</span>
                               </div>
                               <button 
                                  onClick={() => copyToClipboard(codeText)}
                                  className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold px-2 py-0.5 rounded hover:bg-slate-800"
                               >
                                  <Copy size={10} /> Copy Code
                               </button>
                            </div>
                            <pre className="p-4 overflow-x-auto custom-scrollbar">
                              <code className={`${className} font-mono text-sm leading-6`} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        );
                      }
                      return (
                        <code className="bg-slate-800/80 px-1.5 py-0.5 rounded text-sm font-mono text-nexus-secondary border border-slate-700/50" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content.text}
                </ReactMarkdown>
              </div>
            </div>
            
            {/* Standard Large Image for AI Responses */}
            {message.image && !isUser && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 shadow-lg bg-black">
                <img 
                  src={message.image} 
                  alt="Generated content" 
                  className="max-w-full max-h-[500px] object-contain mx-auto" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;