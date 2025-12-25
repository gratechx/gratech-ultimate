import React from 'react';
import { MemoryItem } from '../types';

interface MemoryPanelProps {
  items: MemoryItem[];
  isOpen: boolean;
  toggle: () => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ items, isOpen, toggle }) => {
  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-void-black/80 backdrop-blur-xl border-l border-white/10 transition-all duration-500 z-50 ${isOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-header font-bold text-starlight-cyan tracking-widest uppercase">
            Cortex
          </h2>
          <button onClick={toggle} className="text-white/50 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="text-xs font-mono text-nebula-purple uppercase tracking-wider mb-2">Short-Term Memory</div>
          {items.length === 0 && <p className="text-white/30 text-sm italic">No context stored yet.</p>}
          {items.map(item => (
            <div key={item.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-starlight-cyan/50 transition-colors">
              <span className="text-[10px] uppercase text-white/40 block mb-1">{item.category}</span>
              <p className="text-sm font-mono text-gray-300">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex justify-between text-xs font-mono text-white/50">
             <span>System Status</span>
             <span className="text-starlight-cyan animate-pulse">ONLINE</span>
          </div>
          <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
             <div className="bg-nebula-purple h-full w-[35%] animate-pulse-slow"></div>
          </div>
          <div className="text-[10px] text-right mt-1 text-nebula-purple">TOKEN BUDGET: 32K</div>
        </div>
      </div>
    </div>
  );
};

export default MemoryPanel;