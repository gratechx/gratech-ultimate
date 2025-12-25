import React from 'react';
import { Database, Wifi } from 'lucide-react';

const NetworkStorage: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
       <div className="flex items-center gap-3 mb-6">
          <Database className="text-starlight-cyan" size={24} />
          <h2 className="text-xl font-bold text-white">Storage Metrics</h2>
       </div>
       <div className="space-y-4">
         <div>
            <div className="flex justify-between text-sm mb-2 text-white/70">
              <span>Azure Blob (Z:)</span>
              <span>84% Used</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-red-500 w-[84%]"></div>
            </div>
         </div>
         <div>
            <div className="flex justify-between text-sm mb-2 text-white/70">
              <span>Local Cache</span>
              <span>12% Used</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 w-[12%]"></div>
            </div>
         </div>
       </div>
    </div>
  );
};
export default NetworkStorage;