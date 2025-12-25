import React, { useState } from 'react';
import { Send, Cpu, Zap, Brain, Activity } from 'lucide-react';

const MODELS = [
  { id: 'deepseek', name: 'DeepSeek V3.1', icon: Zap, desc: 'High-speed reasoning' },
  { id: 'llama-405b', name: 'Llama 3.1 405B', icon: Brain, desc: 'Massive open model' },
  { id: 'gpt-5', name: 'GPT-5 (Preview)', icon: Cpu, desc: 'Next-gen intelligence' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: Activity, desc: 'Multimodal standard' }
];

export const SuperBrain: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string, model?: string}[]>([
    { role: 'system', content: 'Gratech Super Brain initialized. Connected to Azure AI Foundry.' }
  ]);
  const [selectedModel, setSelectedModel] = useState('deepseek');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('https://gratech-brain.azurewebsites.net/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          model: selectedModel
        })
      });

      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          model: data.model 
        }]);
      } else {
        throw new Error('No response from brain');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Error connecting to Super Brain: ${error}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-cyan-900/50 rounded-xl p-6 shadow-lg shadow-cyan-900/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Brain className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Gratech Super Brain</h3>
            <p className="text-xs text-cyan-400 font-mono">CONNECTED: {selectedModel.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-2 rounded-lg transition-all ${
                selectedModel === m.id 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={m.desc}
            >
              <m.icon size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950/50 rounded-lg border border-slate-800 h-96 mb-4 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-cyan-900/30 text-cyan-100 border border-cyan-800/50' 
                : msg.role === 'system'
                ? 'bg-slate-800/50 text-slate-400 text-xs w-full text-center'
                : msg.role === 'error'
                ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {msg.model && (
                <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                  {msg.model}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-cyan-400 p-3 rounded-lg border border-slate-700 flex items-center gap-2">
              <Cpu size={14} className="animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={`Ask ${MODELS.find(m => m.id === selectedModel)?.name}...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};


export default SuperBrain;
