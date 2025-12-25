import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, GitMerge, ShieldCheck, Activity, 
  AlertTriangle, RotateCcw, Play, CheckCircle2, 
  Cpu, Lock, Server, ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ModelVersion {
  version: string;
  status: 'STABLE' | 'CANARY' | 'DEPRECATED';
  deployedAt: string;
  traffic: number;
  metrics: {
    latency: number;
    errorRate: number;
  };
}

interface ModelFamily {
  id: string;
  name: string;
  description: string;
  versions: ModelVersion[];
}

const INITIAL_MODELS: ModelFamily[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini 3.0 Pro',
    description: 'Complex reasoning & coding tasks',
    versions: [
      {
        version: 'v3.0.1 (Stable)',
        status: 'STABLE',
        deployedAt: '2025-10-15',
        traffic: 95,
        metrics: { latency: 1200, errorRate: 0.01 }
      },
      {
        version: 'v3.0.2-rc1 (Canary)',
        status: 'CANARY',
        deployedAt: '2025-12-28',
        traffic: 5,
        metrics: { latency: 980, errorRate: 0.05 }
      }
    ]
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    description: 'High-speed, low-cost interactions',
    versions: [
      {
        version: 'v2.5.4 (Stable)',
        status: 'STABLE',
        deployedAt: '2025-11-01',
        traffic: 100,
        metrics: { latency: 150, errorRate: 0.00 }
      }
    ]
  },
  {
    id: 'veo-video',
    name: 'Veo 3.1 Video',
    description: 'Generative video synthesis',
    versions: [
      {
        version: 'v3.1.0 (Stable)',
        status: 'STABLE',
        deployedAt: '2025-12-05',
        traffic: 100,
        metrics: { latency: 15000, errorRate: 0.2 }
      }
    ]
  }
];

const ModelRegistry: React.FC = () => {
  const { checkPermission } = useAuth();
  const [models, setModels] = useState<ModelFamily[]>(INITIAL_MODELS);
  const [selectedModel, setSelectedModel] = useState<string | null>('gemini-pro');
  const [isPromoting, setIsPromoting] = useState(false);

  // Simulation of Canary Metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prev => prev.map(m => {
        if (m.id === 'gemini-pro') {
          return {
            ...m,
            versions: m.versions.map(v => {
              if (v.status === 'CANARY') {
                // Simulate jitter in canary metrics
                return {
                  ...v,
                  metrics: {
                    latency: 900 + Math.random() * 200,
                    errorRate: Math.max(0, 0.05 + (Math.random() * 0.02 - 0.01))
                  }
                };
              }
              return v;
            })
          };
        }
        return m;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!checkPermission('ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-slate-900 border border-red-900/50 p-10 rounded-2xl max-w-md">
           <Lock size={48} className="text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Restricted Area</h2>
           <p className="text-gray-400">
             Neural Governance is restricted to AI Safety Officers.
           </p>
        </div>
      </div>
    );
  }

  const activeModel = models.find(m => m.id === selectedModel);
  const stableVer = activeModel?.versions.find(v => v.status === 'STABLE');
  const canaryVer = activeModel?.versions.find(v => v.status === 'CANARY');

  const handleTrafficChange = (val: number) => {
    if (!activeModel || !canaryVer || !stableVer) return;
    const newModels = models.map(m => {
      if (m.id === activeModel.id) {
        return {
          ...m,
          versions: m.versions.map(v => {
            if (v.status === 'CANARY') return { ...v, traffic: val };
            if (v.status === 'STABLE') return { ...v, traffic: 100 - val };
            return v;
          })
        };
      }
      return m;
    });
    setModels(newModels);
  };

  const handlePromote = () => {
    setIsPromoting(true);
    setTimeout(() => {
       const newModels = models.map(m => {
         if (m.id === activeModel?.id) {
            return {
                ...m,
                versions: [
                    { ...canaryVer!, status: 'STABLE', traffic: 100, version: canaryVer!.version.replace(' (Canary)', ' (Stable)') },
                    { ...stableVer!, status: 'DEPRECATED', traffic: 0, version: stableVer!.version.replace(' (Stable)', ' (Legacy)') }
                ] as ModelVersion[]
            };
         }
         return m;
       });
       setModels(newModels);
       setIsPromoting(false);
    }, 2000);
  };

  const handleRollback = () => {
    if(!canaryVer) return;
    const newModels = models.map(m => {
      if(m.id === activeModel?.id) {
        return {
          ...m,
          versions: m.versions.map(v => {
            if(v.status === 'STABLE') return {...v, traffic: 100};
            if(v.status === 'CANARY') return {...v, traffic: 0};
            return v;
          })
        };
      }
      return m;
    });
    setModels(newModels);
    alert("Emergency Rollback Executed. Traffic routed to Stable.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <GitPullRequest className="text-nexus-primary" size={32} />
             Neural Governance Console
          </h2>
          <p className="text-gray-400 mt-2">
            AI Model Lifecycle Management • Canary Deployment • Safety Rollbacks
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-400" />
              <span className="text-sm text-gray-300 font-mono">REGISTRY: SECURE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
         {/* Sidebar List */}
         <div className="space-y-3">
            {models.map(m => (
               <div 
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedModel === m.id 
                    ? 'bg-nexus-primary/10 border-nexus-primary/50 shadow-lg shadow-nexus-primary/10' 
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                  }`}
               >
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-white">{m.name}</span>
                     {m.versions.some(v => v.status === 'CANARY') && (
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                     )}
                  </div>
                  <p className="text-xs text-gray-500">{m.description}</p>
                  <div className="mt-3 flex gap-2">
                     <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-gray-300 border border-slate-700">
                        {m.versions.find(v => v.status === 'STABLE')?.version}
                     </span>
                  </div>
               </div>
            ))}
         </div>

         {/* Main Control Panel */}
         <div className="lg:col-span-3 space-y-6">
            {activeModel ? (
               <>
                  {/* Status Banner */}
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10">
                            <Cpu size={32} className="text-nexus-secondary" />
                         </div>
                         <div>
                            <h3 className="text-xl font-bold text-white">{activeModel.name}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                               <span className="flex items-center gap-1"><Server size={14} /> Global Endpoints</span>
                               <span className="flex items-center gap-1"><Activity size={14} /> Auto-Scaling</span>
                            </div>
                         </div>
                      </div>

                      {canaryVer ? (
                          <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 rounded-lg">
                              <AlertTriangle className="text-yellow-500" />
                              <div>
                                  <div className="text-sm font-bold text-yellow-500">CANARY DEPLOYMENT ACTIVE</div>
                                  <div className="text-xs text-yellow-200/70">Traffic Split: {stableVer?.traffic}% / {canaryVer.traffic}%</div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 px-4 py-3 rounded-lg">
                              <CheckCircle2 className="text-green-500" />
                              <div>
                                  <div className="text-sm font-bold text-green-500">ALL SYSTEMS STABLE</div>
                                  <div className="text-xs text-green-200/70">100% Traffic to {stableVer?.version}</div>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Comparison Grid */}
                  {canaryVer && stableVer && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Stable Column */}
                          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                              <div className="flex justify-between items-center mb-6">
                                  <div className="flex items-center gap-2">
                                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Lock size={16} /></div>
                                      <span className="font-bold text-blue-400 text-sm">STABLE (Current)</span>
                                  </div>
                                  <span className="text-xs font-mono text-gray-500">{stableVer.version}</span>
                              </div>
                              
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                      <span className="text-xs text-gray-400">Latency (P95)</span>
                                      <span className="font-mono text-white">{stableVer.metrics.latency}ms</span>
                                  </div>
                                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                      <span className="text-xs text-gray-400">Error Rate</span>
                                      <span className="font-mono text-green-400">{stableVer.metrics.errorRate}%</span>
                                  </div>
                              </div>
                          </div>

                          {/* Canary Column */}
                          <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-6 relative overflow-hidden">
                              <div className="flex justify-between items-center mb-6">
                                  <div className="flex items-center gap-2">
                                      <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><GitMerge size={16} /></div>
                                      <span className="font-bold text-yellow-400 text-sm">CANARY (Candidate)</span>
                                  </div>
                                  <span className="text-xs font-mono text-gray-500">{canaryVer.version}</span>
                              </div>

                              <div className="space-y-4">
                                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                      <span className="text-xs text-gray-400">Latency (P95)</span>
                                      <span className={`font-mono ${canaryVer.metrics.latency < stableVer.metrics.latency ? 'text-green-400' : 'text-red-400'}`}>
                                          {canaryVer.metrics.latency.toFixed(0)}ms
                                          {canaryVer.metrics.latency < stableVer.metrics.latency && <span className="text-[10px] ml-2">(-{(stableVer.metrics.latency - canaryVer.metrics.latency).toFixed(0)})</span>}
                                      </span>
                                  </div>
                                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                      <span className="text-xs text-gray-400">Error Rate</span>
                                      <span className={`font-mono ${canaryVer.metrics.errorRate > stableVer.metrics.errorRate ? 'text-red-400' : 'text-green-400'}`}>
                                          {(canaryVer.metrics.errorRate * 100).toFixed(2)}%
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Controls */}
                  {canaryVer && (
                     <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h4 className="font-bold text-white mb-6">Traffic Routing Configuration</h4>
                        
                        <div className="mb-8">
                           <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-blue-400">Stable: {stableVer?.traffic}%</span>
                              <span className="text-yellow-400">Canary: {canaryVer.traffic}%</span>
                           </div>
                           <input 
                              type="range" 
                              min="0" 
                              max="50" 
                              value={canaryVer.traffic} 
                              onChange={(e) => handleTrafficChange(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                           />
                           <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono">
                              <span>0%</span>
                              <span>25%</span>
                              <span>50% (Max Safe Limit)</span>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button 
                              onClick={handlePromote}
                              disabled={isPromoting}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              {isPromoting ? (
                                  <>Processing...</>
                              ) : (
                                  <>
                                     <ArrowRight size={18} /> PROMOTE CANARY TO STABLE
                                  </>
                              )}
                           </button>
                           
                           <button 
                              onClick={handleRollback}
                              className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-500/30 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                           >
                              <RotateCcw size={18} /> EMERGENCY ROLLBACK
                           </button>
                        </div>
                     </div>
                  )}

                  {!canaryVer && (
                      <div className="flex flex-col items-center justify-center p-10 bg-slate-900/30 border border-slate-800 border-dashed rounded-xl text-center">
                          <CheckCircle2 size={48} className="text-green-500/20 mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">No Active Canary Deployments</h3>
                          <p className="text-gray-500 max-w-md">
                             The current stable version {stableVer?.version} is fully deployed. No candidate versions are currently in the testing pipeline.
                          </p>
                      </div>
                  )}

               </>
            ) : (
               <div className="flex items-center justify-center h-full text-gray-500">
                  Select a model to manage governance.
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ModelRegistry;