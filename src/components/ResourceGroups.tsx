import React from 'react';
import { Layers } from 'lucide-react';

const ResourceGroups: React.FC = () => {
  return (
    <div className="p-8 text-center">
       <Layers size={48} className="mx-auto text-white/20 mb-4" />
       <h2 className="text-xl font-bold text-white mb-2">Resource Groups</h2>
       <p className="text-white/50">No active resource groups allocated in current session.</p>
    </div>
  );
};
export default ResourceGroups;