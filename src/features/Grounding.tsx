import React, { useState, useEffect } from 'react';
import { groundingSearch } from '../services/geminiService';
import { Search, Map, ExternalLink, History, ArrowUpRight, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Grounding: React.FC = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'search' | 'maps'>('search');
  const [result, setResult] = useState<{text: string, chunks: any[]} | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_grounding_history');
    if (saved) {
        setHistory(JSON.parse(saved));
    }
  }, []);

  const addToHistory = (q: string) => {
      const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('nexus_grounding_history', JSON.stringify(newHistory));
  };

  const clearHistory = (e: React.MouseEvent) => {
      e.stopPropagation();
      setHistory([]);
      localStorage.removeItem('nexus_grounding_history');
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    setResult(null);
    if(searchQuery !== query) setQuery(searchQuery);
    
    addToHistory(searchQuery);

    try {
        const data = await groundingSearch(searchQuery, type);
        setResult(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Real-World Knowledge Base</h2>
            <p className="text-gray-400">Grounded in Google Search and Maps data.</p>
        </div>

        <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 flex items-center shadow-inner">
                <input 
                    className="bg-transparent w-full text-white px-2 focus:outline-none"
                    placeholder={type === 'search' ? "Search for latest events, news..." : "Find places, restaurants..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <div className="flex bg-slate-800 rounded-lg p-1">
                <button 
                    onClick={() => setType('search')}
                    className={`p-2 rounded transition-colors ${type === 'search' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    title="Google Search"
                >
                    <Search size={20} />
                </button>
                <button 
                    onClick={() => setType('maps')}
                    className={`p-2 rounded transition-colors ${type === 'maps' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    title="Google Maps"
                >
                    <Map size={20} />
                </button>
            </div>
            <button 
                onClick={() => handleSearch(query)}
                disabled={loading}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loading ? 'Searching...' : 'Go'}
            </button>
        </div>

        {history.length > 0 && (
            <div className="mb-8 border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
                <button 
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="w-full flex items-center justify-between p-3 text-xs text-gray-500 hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        {isHistoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <History size={12} />
                        <span className="font-bold tracking-wider">RECENT QUERIES</span>
                    </div>
                    <div 
                        onClick={clearHistory}
                        className="p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                        title="Clear History"
                    >
                        <Trash2 size={12} />
                    </div>
                </button>
                
                {isHistoryOpen && (
                    <div className="p-3 pt-0 flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                        {history.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSearch(item)}
                                className="text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-nexus-primary/30 transition-all flex items-center gap-1 group"
                            >
                                {item}
                                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-nexus-secondary" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )}

        {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-a:text-nexus-secondary">
                        <ReactMarkdown>{result.text}</ReactMarkdown>
                    </div>
                </div>

                {result.chunks && result.chunks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.chunks.map((chunk, idx) => (
                            <div key={idx} className="bg-slate-800 p-4 rounded-lg text-sm border border-slate-700 hover:border-nexus-secondary/30 transition-colors">
                                {chunk.web ? (
                                    <>
                                        <div className="font-bold text-blue-400 mb-2 truncate">{chunk.web.title}</div>
                                        <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                                            <ExternalLink size={10} /> {chunk.web.uri}
                                        </a>
                                    </>
                                ) : chunk.maps ? (
                                     <>
                                        <div className="font-bold text-green-400 mb-2">{chunk.maps.title}</div>
                                        {chunk.maps.placeAnswerSources?.map((source: any, i: number) => (
                                            <div key={i} className="text-gray-400 mt-1 italic">"{source.reviewSnippets?.[0]}"</div>
                                        ))}
                                        {chunk.maps.googleMapsUri && (
                                            <a href={chunk.maps.googleMapsUri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 mt-3 hover:text-green-400 transition-colors">
                                                View on Maps <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default Grounding;