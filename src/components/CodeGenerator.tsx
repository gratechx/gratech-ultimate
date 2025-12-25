import React, { useState, useRef, useEffect } from 'react';
import { Play, Terminal, Cpu, Layout, Code, Eye, RefreshCw, Zap, FileCode, CheckCircle2 } from 'lucide-react';
import { generateWebProject } from '../services/geminiService';

type Tab = 'html' | 'css' | 'js';

const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState({
    html: '<div class="container">\n  <h1>Nexus Code Studio</h1>\n  <p>Awaiting instructions...</p>\n</div>',
    css: 'body { background: #0f0f12; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n.container { text-align: center; }',
    javascript: 'console.log("Nexus Sandbox Initialized.");'
  });
  const [activeTab, setActiveTab] = useState<Tab>('html');
  const [isGenerating, setIsGenerating] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [logs, setLogs] = useState<string[]>(['> System Ready.']);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    addLog('Analyzing requirements...');
    
    try {
      addLog('Gemini 3.0 Pro: Architecting solution...');
      const result = await generateWebProject(prompt);
      setCode({
          html: result.html || '',
          css: result.css || '',
          javascript: result.javascript || ''
      });
      addLog('Code generation complete.');
      setIframeKey(prev => prev + 1); // Force re-render iframe
    } catch (error) {
      addLog('Error: Failed to generate code.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>
            try {
              ${code.javascript}
            } catch (e) {
              document.body.innerHTML += '<div style="color:red;padding:10px;border-top:1px solid #333;margin-top:20px;">Runtime Error: ' + e.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 bg-[#0a0a0a] overflow-hidden animate-fade-in">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-nexus-primary/20 rounded-lg text-nexus-primary">
                    <Terminal size={20} />
                </div>
                <div>
                    <h2 className="font-header font-bold text-white tracking-widest text-lg">CODE STUDIO</h2>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                        <Cpu size={10} /> GEMINI 3.0 PRO <span className="text-gray-600">|</span> 
                        <Zap size={10} className="text-yellow-500" /> SANDBOX ACTIVE
                    </div>
                </div>
            </div>
            
            <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                <button 
                    onClick={() => setIframeKey(prev => prev + 1)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                    <RefreshCw size={12} /> RELOAD PREVIEW
                </button>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex gap-4 min-h-0">
            
            {/* Left Pane: Controls & Editor */}
            <div className="w-1/2 flex flex-col gap-4">
                
                {/* Prompt Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shrink-0">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your web app (e.g., 'A pomodoro timer with neon cyber aesthetics')..."
                        className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-sm font-mono text-white resize-none h-20 focus:border-nexus-primary/50 focus:outline-none placeholder-gray-600"
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {logs.map((log, i) => (
                                <span key={i} className="text-[10px] font-mono text-gray-500 animate-pulse">{i === logs.length -1 ? log : ''}</span>
                            ))}
                        </div>
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className={`px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                                isGenerating 
                                ? 'bg-slate-800 text-gray-500 cursor-not-allowed' 
                                : 'bg-nexus-primary hover:bg-violet-600 text-white shadow-lg shadow-violet-900/20'
                            }`}
                        >
                            {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
                            {isGenerating ? 'BUILDING...' : 'GENERATE'}
                        </button>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 bg-[#1e1e1e] border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center bg-[#252526] border-b border-black">
                        {(['html', 'css', 'js'] as Tab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-xs font-mono border-r border-black flex items-center gap-2 transition-colors ${
                                    activeTab === tab 
                                    ? 'bg-[#1e1e1e] text-white border-t-2 border-t-nexus-primary' 
                                    : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#333]'
                                }`}
                            >
                                <FileCode size={12} className={
                                    tab === 'html' ? 'text-orange-400' : 
                                    tab === 'css' ? 'text-blue-400' : 'text-yellow-400'
                                } />
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <textarea 
                        value={
                            activeTab === 'html' ? code.html : 
                            activeTab === 'css' ? code.css : 
                            code.javascript
                        }
                        onChange={(e) => setCode(prev => ({
                            ...prev, 
                            [activeTab === 'js' ? 'javascript' : activeTab]: e.target.value
                        }))}
                        className="flex-1 bg-[#1e1e1e] text-gray-300 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed custom-scrollbar"
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Right Pane: Live Preview */}
            <div className="w-1/2 flex flex-col">
                <div className="flex-1 bg-white rounded-xl overflow-hidden border border-slate-700 relative shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2 z-10">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-300 rounded text-[10px] text-gray-500 px-2 py-0.5 text-center font-mono">
                            localhost:3000/preview
                        </div>
                    </div>
                    <iframe 
                        key={iframeKey}
                        srcDoc={getSrcDoc()}
                        title="Live Preview"
                        className="w-full h-full pt-8 bg-white"
                        sandbox="allow-scripts"
                    />
                </div>
                
                <div className="h-32 mt-4 bg-black border border-slate-800 rounded-xl p-3 font-mono text-xs text-green-400 overflow-y-auto custom-scrollbar">
                    <div className="text-gray-500 border-b border-slate-800 pb-1 mb-2 flex justify-between">
                        <span>TERMINAL OUTPUT</span>
                        <span>node v18.16.0</span>
                    </div>
                    {logs.map((l, i) => (
                        <div key={i}>{l}</div>
                    ))}
                    {isGenerating && <div className="animate-pulse">_</div>}
                </div>
            </div>

        </div>
    </div>
  );
};

export default CodeGenerator;