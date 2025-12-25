import React from 'react';
import { Activity, Server, Cpu, Database } from 'lucide-react';

const Compute: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
       {[
         { icon: Server, label: 'Node Alpha', status: 'Active', load: 45 },
         { icon: Database, label: 'Cluster Beta', status: 'Idle', load: 12 },
         { icon: Cpu, label: 'Neural Engine', status: 'Processing', load: 89 },
         { icon: Activity, label: 'Network I/O', status: 'Stable', load: 34 },
       ].map((item, i) => (
         <div key={i} className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <item.icon size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-white/5 rounded-lg text-starlight-cyan">
                 <item.icon size={24} />
               </div>
               <div>
                 <div className="text-sm text-white/50 uppercase tracking-wider">{item.status}</div>
                 <div className="text-xl font-bold text-white">{item.label}</div>
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-mono text-white/50">
                  <span>Load</span>
                  <span>{item.load}%</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-starlight-cyan to-nebula-purple transition-all duration-1000" 
                    style={{ width: `${item.load}%` }}
                  ></div>
               </div>
            </div>
         </div>
       ))}
    </div>
  );
};
export default Compute;