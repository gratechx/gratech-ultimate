import React from 'react';
import { Download, File } from 'lucide-react';

const DownloadsHub: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
       <h2 className="text-2xl font-header font-bold text-white mb-6">System Artifacts</h2>
       <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded text-white/50">
                     <File size={20} />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-white">system_log_v{i}.log</div>
                     <div className="text-xs text-white/30">2.4 MB • 2025-12-0{i}</div>
                  </div>
               </div>
               <button className="p-2 hover:text-starlight-cyan transition-colors">
                  <Download size={20} />
               </button>
            </div>
          ))}
       </div>
    </div>
  );
};
export default DownloadsHub;