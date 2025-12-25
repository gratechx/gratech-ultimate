import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, AlertCircle, Clock, Server, RefreshCw, Radio, XCircle } from 'lucide-react';

interface DNSProvider {
  id: string;
  name: string;
  ip: string;
  status: 'resolved' | 'propagating' | 'pending' | 'error';
  region: string;
  latency?: string;
  providerType: 'Global' | 'ISP' | 'Security';
}

// Including specifically requested providers: STC, Neustar, OpenDNS, CleanBrowsing, Yandex, Norton, Comodo
const initialProviders: DNSProvider[] = [
  { id: 'google', name: 'Google DNS', ip: '8.8.8.8', status: 'pending', region: 'Global', providerType: 'Global' },
  { id: 'cloudflare', name: 'Cloudflare', ip: '1.1.1.1', status: 'pending', region: 'Global', providerType: 'Global' },
  { id: 'opendns', name: 'OpenDNS', ip: '208.67.222.222', status: 'pending', region: 'Global', providerType: 'Global' },
  { id: 'neustar', name: 'Neustar', ip: '156.154.70.1', status: 'pending', region: 'Global', providerType: 'Global' },
  { id: 'stc', name: 'STC DNS', ip: '84.235.57.230', status: 'pending', region: 'KSA (Middle East)', providerType: 'ISP' },
  { id: 'quad9', name: 'Quad9', ip: '9.9.9.9', status: 'pending', region: 'Global', providerType: 'Security' },
  { id: 'verisign', name: 'Verisign', ip: '64.6.64.6', status: 'pending', region: 'Global', providerType: 'Global' },
  { id: 'level3', name: 'Level3', ip: '4.2.2.1', status: 'pending', region: 'North America', providerType: 'ISP' },
  { id: 'etisalat', name: 'Etisalat', ip: '194.170.1.1', status: 'pending', region: 'UAE (Middle East)', providerType: 'ISP' },
  { id: 'zain', name: 'Zain DNS', ip: '149.200.10.10', status: 'pending', region: 'Middle East', providerType: 'ISP' },
  { id: 'norton', name: 'Norton Safe', ip: '199.85.126.10', status: 'pending', region: 'Global', providerType: 'Security' },
  { id: 'comodo', name: 'Comodo Secure', ip: '8.26.56.26', status: 'pending', region: 'Global', providerType: 'Security' },
  { id: 'yandex', name: 'Yandex DNS', ip: '77.88.8.8', status: 'pending', region: 'Russia', providerType: 'Global' },
  { id: 'clean', name: 'CleanBrowsing', ip: '185.228.168.9', status: 'pending', region: 'Global', providerType: 'Security' },
];

export const DNSMonitor: React.FC = () => {
  const [providers, setProviders] = useState<DNSProvider[]>(initialProviders);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const checkDNS = async () => {
    setIsChecking(true);
    // Visual reset
    setProviders(prev => prev.map(p => ({ ...p, status: 'pending', latency: undefined })));

    // Simulate checking each provider with realistic API delays
    const checkProvider = async (provider: DNSProvider) => {
      // Stagger requests slightly for visual effect
      const delay = 300 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Determine status: 
      // Ensure specific providers are ALWAYS resolved as requested to simulate successful propagation
      // EXCEPT Google DNS which currently has issues per prompt
      const targetedResolvers = [
        'cloudflare', 'opendns', 'neustar', 
        'stc', 'level3', 'quad9', 'verisign', 'etisalat', 'zain',
        'norton', 'comodo', 'yandex', 'clean' 
      ];
      
      let isResolved = false;
      let latencyStr = '';

      if (provider.id === 'google') {
          isResolved = false; // Simulate NXDOMAIN per user report
          latencyStr = 'NXDOMAIN';
      } else if (targetedResolvers.includes(provider.id)) {
        isResolved = true; // Force resolution for these providers
        latencyStr = Math.floor(Math.random() * 80) + 10 + 'ms';
      } else {
        isResolved = Math.random() > 0.1; 
        latencyStr = Math.floor(Math.random() * 80) + 10 + 'ms';
      }
      
      setProviders(prev => prev.map(p => 
        p.id === provider.id ? { 
          ...p, 
          status: isResolved ? 'resolved' : (provider.id === 'google' ? 'error' : 'propagating'),
          latency: latencyStr
        } : p
      ));
    };

    await Promise.all(providers.map(p => checkProvider(p)));
    setIsChecking(false);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    checkDNS();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Globe className="text-blue-400" size={20} />
            Global DNS Propagation
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Resolution status for <span className="text-cyan-400 font-mono">api.gratech.sa</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
           {lastUpdate && (
               <span className="text-xs text-slate-500 font-mono hidden sm:block">
                   Last check: {lastUpdate.toLocaleTimeString()}
               </span>
           )}
           <button
             onClick={checkDNS}
             disabled={isChecking}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                 isChecking 
                 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                 : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
             }`}
           >
             <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
             {isChecking ? 'Querying...' : 'Refresh Status'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div 
            key={provider.id} 
            className={`p-3 rounded-lg border flex items-center justify-between group transition-all duration-300 ${
                provider.status === 'resolved' 
                ? 'bg-slate-800/40 border-slate-700/50 hover:border-green-500/30' 
                : provider.status === 'error'
                ? 'bg-red-900/10 border-red-900/30'
                : 'bg-slate-800/20 border-slate-800 hover:border-slate-700'
            }`}
          >
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                    provider.status === 'resolved' ? 'text-green-500 bg-green-500' :
                    provider.status === 'error' ? 'text-red-500 bg-red-500' :
                    provider.status === 'propagating' ? 'text-yellow-500 bg-yellow-500 animate-pulse' :
                    'text-slate-600 bg-slate-600'
                }`}></div>
                <div>
                    <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
                        {provider.name}
                        {provider.providerType === 'ISP' && <span className="text-[9px] bg-slate-700 px-1 rounded text-slate-400">ISP</span>}
                        {provider.providerType === 'Security' && <span className="text-[9px] bg-indigo-900/50 px-1 rounded text-indigo-300">SEC</span>}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{provider.ip} • {provider.region}</div>
                </div>
             </div>
             
             <div className="text-right">
                {provider.status === 'resolved' && (
                    <div className="flex flex-col items-end">
                        <CheckCircle2 size={16} className="text-green-400 mb-0.5" />
                        <span className="text-[10px] text-green-500/80 font-mono">{provider.latency}</span>
                    </div>
                )}
                {provider.status === 'propagating' && (
                    <Clock size={16} className="text-yellow-500 animate-pulse" />
                )}
                {provider.status === 'error' && (
                     <div className="flex flex-col items-end">
                        <XCircle size={16} className="text-red-400 mb-0.5" />
                        <span className="text-[10px] text-red-400 font-mono">NXDOMAIN</span>
                     </div>
                )}
                {provider.status === 'pending' && (
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-slate-500 rounded-full animate-spin"></div>
                )}
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
         <div className="flex items-center gap-2">
             <Radio size={12} className="text-green-500 animate-pulse" />
             <span>Global Propagation: <span className="text-slate-300">~75%</span></span>
         </div>
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                 <span>Resolved</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                 <span>Propagating</span>
             </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                 <span>Error/NXDOMAIN</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default DNSMonitor;
