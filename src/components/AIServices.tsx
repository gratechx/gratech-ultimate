import React from 'react';
import { Bot, Zap, Clock, Coins } from 'lucide-react';

const AIServices: React.FC = () => {
  const services = [
    { name: 'Gemini 3.0 Pro', status: 'Online', latency: '120ms', type: 'Reasoning', color: 'text-nexus-primary' },
    { name: 'Gemini 2.5 Flash', status: 'Online', latency: '45ms', type: 'High Speed', color: 'text-nexus-secondary' },
    { name: 'Veo 3.1 Fast', status: 'Online', latency: '8.2s', type: 'Video Gen', color: 'text-pink-400' },
    { name: 'Imagen 3.0', status: 'Online', latency: '2.1s', type: 'Image Gen', color: 'text-orange-400' },
    { name: 'Gemini Live', status: 'Active', latency: '42ms', type: 'Audio Stream', color: 'text-green-400' },
  ];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 h-full flex flex-col">
       <div className="flex items-center gap-3 mb-6">
          <Bot className="text-nebula-purple" size={24} />
          <h2 className="text-xl font-bold text-white">Neural Engine Status</h2>
       </div>
       <div className="grid gap-3 flex-1">
          {services.map(m => (
            <div key={m.name} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
               <div className="flex flex-col">
                   <span className="font-bold text-sm text-gray-200 flex items-center gap-2">
                       {m.name}
                       <span className={`text-[10px] px-1.5 py-0.5 rounded bg-white/5 ${m.color}`}>{m.type}</span>
                   </span>
               </div>
               <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-500" title="Latency">
                      <Clock size={12} />
                      {m.latency}
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                      <Zap size={12} fill="currentColor" />
                      {m.status}
                  </div>
               </div>
            </div>
          ))}
       </div>
       <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-gray-500">
           <span className="flex items-center gap-1"><Coins size={12} /> Budget Efficiency</span>
           <span className="text-starlight-cyan">94% Optimal</span>
       </div>
    </div>
  );
};
export default AIServices;