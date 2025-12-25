import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Globe, Server, Database, RefreshCw, Activity, 
  CheckCircle, AlertTriangle, Play, Pause, AlertOctagon,
  ArrowRight, HardDrive, Lock, Terminal, Clock, FileCheck, TrendingDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DisasterRecovery: React.FC = () => {
  const { checkPermission } = useAuth();
  
  const [activeRegion, setActiveRegion] = useState('uae-north');
  const [failoverStatus, setFailoverStatus] = useState<'IDLE' | 'INITIATING' | 'SYNCING' | 'COMPLETED'>('IDLE');
  const [rpo, setRpo] = useState(12); // seconds
  const [rto, setRto] = useState(45); // seconds
  const [walLogs, setWalLogs] = useState<string[]>([]);
  
  // Interactive Chart Data
  const [rpoHistory, setRpoHistory] = useState<number[]>(Array(20).fill(12));
  const [rtoHistory, setRtoHistory] = useState<number[]>(Array(20).fill(45));
  
  // Backup Verification State
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const walEndRef = useRef<HTMLDivElement>(null);
  const verifyEndRef = useRef<HTMLDivElement>(null);

  // Simulate WAL logs and metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const newRpo = Math.floor(10 + Math.random() * 5);
      const newRto = Math.floor(40 + Math.random() * 10);
      
      setRpo(newRpo);
      setRto(newRto);
      
      setRpoHistory(prev => [...prev.slice(1), newRpo]);
      setRtoHistory(prev => [...prev.slice(1), newRto]);

      const newLog = `[WAL-SHIPPER] Archived seg_${Date.now().toString().slice(-6)} to Azure Blob (West Europe)`;
      setWalLogs(prev => [...prev.slice(-15), newLog]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    walEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [walLogs]);

  useEffect(() => {
    verifyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [verificationLogs]);

  if (!checkPermission('ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-slate-900 border border-red-900/50 p-10 rounded-2xl max-w-md">
           <Lock size={48} className="text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
           <p className="text-gray-400">
             Disaster Recovery controls are restricted to Platform Administrators.
           </p>
        </div>
      </div>
    );
  }

  const handleTestFailover = () => {
    setFailoverStatus('INITIATING');
    setTimeout(() => setFailoverStatus('SYNCING'), 1500);
    setTimeout(() => setFailoverStatus('COMPLETED'), 4000);
    setTimeout(() => {
      setFailoverStatus('IDLE');
      setActiveRegion(activeRegion === 'uae-north' ? 'west-europe' : 'uae-north');
    }, 6000);
  };

  const runBackupVerification = async () => {
      if (verificationStatus === 'RUNNING') return;
      setVerificationStatus('RUNNING');
      setVerificationLogs(['Initializing Runbook 3: Backup Verification...', 'Target RPO: < 5 minutes']);
      setProgress(5);

      const steps = [
          { msg: 'Connecting to Azure Blob Storage (gratech-backups)...', delay: 1000, prog: 15 },
          { msg: '✓ Latest base backup found: base_20251210_0000.tar.gz', delay: 2000, prog: 30 },
          { msg: 'Downloading and extracting base backup to secure sandbox...', delay: 3500, prog: 50 },
          { msg: 'Configuring recovery.conf with WAL archive stream...', delay: 4500, prog: 65 },
          { msg: 'Starting temporary PostgreSQL container (gratech-restore-test)...', delay: 6000, prog: 80 },
          { msg: 'Replaying WAL segments... (Point-in-Time Recovery)', delay: 8000, prog: 90 },
          { msg: 'Executing validation query: SELECT count(*) FROM ai_interactions...', delay: 9000, prog: 95 },
          { msg: '✅ SUCCESS: 14,203 records recovered. Data consistency verified.', delay: 10000, prog: 100 },
          { msg: '✓ SAMA RPO Compliance Verified.', delay: 10500, prog: 100 }
      ];

      for (const step of steps) {
          await new Promise(r => setTimeout(r, step.delay - (steps[steps.indexOf(step)-1]?.delay || 0)));
          setVerificationLogs(prev => [...prev, step.msg]);
          setProgress(step.prog);
      }
      setVerificationStatus('SUCCESS');
  };

  const SimpleChart = ({ data, color, maxVal }: { data: number[], color: string, maxVal: number }) => (
      <div className="h-16 flex items-end gap-1 mt-2">
          {data.map((val, i) => (
              <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-500 ${color}`}
                  style={{ height: `${(val / maxVal) * 100}%` }}
              ></div>
          ))}
      </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <ShieldAlert className="text-nexus-primary" size={32} />
             Resilience Command Center
          </h2>
          <p className="text-gray-400 mt-2">
            Disaster Recovery (DR) & Business Continuity (BC) Orchestration
          </p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs font-mono text-green-400 flex items-center gap-2">
              <CheckCircle size={12} /> NCA COMPLIANT
           </div>
           <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-mono text-blue-400 flex items-center gap-2">
              <CheckCircle size={12} /> SAMA ALIGNED
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={60} /></div>
            <div className="text-sm text-gray-400 mb-1">Current RPO</div>
            <div className="text-3xl font-bold text-white font-mono flex items-baseline gap-2">
               {rpo}s <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Target: &lt; 5m</span>
            </div>
            <SimpleChart data={rpoHistory} color="bg-green-500" maxVal={30} />
            <div className="text-xs text-gray-500 mt-2">PostgreSQL WAL Streaming</div>
         </div>

         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw size={60} /></div>
            <div className="text-sm text-gray-400 mb-1">Estimated RTO</div>
            <div className="text-3xl font-bold text-white font-mono flex items-baseline gap-2">
               {rto}s <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Target: &lt; 4h</span>
            </div>
            <SimpleChart data={rtoHistory} color="bg-blue-500" maxVal={100} />
            <div className="text-xs text-gray-500 mt-2">Traffic Manager TTL: 60s</div>
         </div>

         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><HardDrive size={60} /></div>
            <div className="text-sm text-gray-400 mb-1">Backup Retention</div>
            <div className="text-3xl font-bold text-white font-mono">7 Years</div>
            <div className="text-xs text-gray-500 mt-4 pt-10 border-t border-white/5">Immutable GRS Storage (Azure)</div>
         </div>

         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Lock size={60} /></div>
            <div className="text-sm text-gray-400 mb-1">Integrity Check</div>
            <div className="text-3xl font-bold text-green-400 font-mono">VERIFIED</div>
            <div className="text-xs text-gray-500 mt-4 pt-10 border-t border-white/5">Blockchain Manifest Match</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Live Topology Map */}
         <div className="bg-black border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="flex justify-between items-center mb-6 z-10">
                <h3 className="font-bold text-white flex items-center gap-2"><Globe size={18} /> Active Topology</h3>
                <span className="text-xs font-mono text-nexus-primary animate-pulse">LIVE REPLICATION</span>
            </div>

            {/* Abstract Map Visualization */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black"></div>
            
            <div className="relative z-10 flex-1 flex justify-between items-center px-8">
               
               {/* West Europe (Secondary) */}
               <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${activeRegion === 'west-europe' ? 'scale-110' : 'opacity-70'}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 bg-slate-900 relative ${activeRegion === 'west-europe' ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-yellow-500'}`}>
                     <Server size={32} className={activeRegion === 'west-europe' ? 'text-green-400' : 'text-yellow-500'} />
                     <div className="absolute -bottom-2 px-2 py-0.5 bg-black border border-white/20 rounded text-[10px] uppercase font-mono">Secondary</div>
                  </div>
                  <div className="text-center">
                     <div className="font-bold text-white">Azure West Europe</div>
                     <div className="text-xs text-gray-500">Netherlands</div>
                  </div>
               </div>

               {/* Connection Lines */}
               <div className="flex-1 h-px bg-white/20 relative mx-4">
                  <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-center gap-8 ${failoverStatus === 'SYNCING' ? 'animate-pulse' : ''}`}>
                     <div className="w-2 h-2 rounded-full bg-nexus-primary animate-ping"></div>
                     <div className="w-2 h-2 rounded-full bg-nexus-primary animate-ping" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-2 h-2 rounded-full bg-nexus-primary animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
               </div>

               {/* UAE North (Primary) */}
               <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${activeRegion === 'uae-north' ? 'scale-110' : 'opacity-70'}`}>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 bg-slate-900 relative ${activeRegion === 'uae-north' ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-slate-700'}`}>
                     <Globe size={40} className={activeRegion === 'uae-north' ? 'text-green-400' : 'text-gray-500'} />
                     <div className="absolute -bottom-3 px-3 py-1 bg-nexus-primary text-white rounded text-xs font-bold font-mono shadow-lg">PRIMARY</div>
                  </div>
                  <div className="text-center">
                     <div className="font-bold text-white text-lg">Azure UAE North</div>
                     <div className="text-sm text-gray-500">Dubai / Riyadh Link</div>
                  </div>
               </div>
            </div>

            <div className="z-10 mt-8 p-4 bg-slate-900/80 rounded-lg border border-white/10">
                <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Failover Controls</h4>
                <div className="flex gap-3">
                    <button 
                        onClick={handleTestFailover}
                        disabled={failoverStatus !== 'IDLE'}
                        className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            failoverStatus !== 'IDLE' 
                            ? 'bg-slate-800 text-gray-500' 
                            : 'bg-nexus-primary hover:bg-violet-600 text-white'
                        }`}
                    >
                        {failoverStatus !== 'IDLE' ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                        {failoverStatus !== 'IDLE' ? 'SWITCHING...' : 'TEST TRAFFIC SWITCH'}
                    </button>
                    <button className="flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 bg-red-900/20 text-red-500 border border-red-500/30 hover:bg-red-900/40 transition-all">
                        <AlertOctagon size={14} /> EMERGENCY FAILOVER
                    </button>
                </div>
            </div>
         </div>

         {/* Runbook 3: Backup Verification */}
         <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-white flex items-center gap-2">
                      <FileCheck size={18} className="text-green-400" /> 
                      Compliance Verification
                   </h3>
                   <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-1 rounded border border-slate-700 font-mono">
                       RUNBOOK #3
                   </span>
               </div>

               <div className="flex-1 bg-black rounded-lg border border-slate-800 p-4 font-mono text-xs overflow-hidden flex flex-col mb-4 relative">
                   <div className="absolute top-2 right-2">
                       {verificationStatus === 'SUCCESS' && <CheckCircle size={16} className="text-green-500" />}
                       {verificationStatus === 'RUNNING' && <RefreshCw size={16} className="text-nexus-primary animate-spin" />}
                   </div>
                   <div className="text-gray-500 border-b border-slate-800 pb-2 mb-2 flex items-center gap-2">
                       <Terminal size={12} /> VERIFICATION_LOGS
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                       {verificationLogs.length === 0 && <span className="text-gray-600 italic">Ready to verify RPO targets...</span>}
                       {verificationLogs.map((log, i) => (
                           <div key={i} className={`${log.includes('SUCCESS') ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
                               <span className="text-slate-600 mr-2">$</span>{log}
                           </div>
                       ))}
                       <div ref={verifyEndRef} />
                   </div>
               </div>

               {verificationStatus !== 'IDLE' && (
                   <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                       <div 
                           className={`h-full transition-all duration-500 ${verificationStatus === 'SUCCESS' ? 'bg-green-500' : 'bg-nexus-primary'}`}
                           style={{ width: `${progress}%` }}
                       ></div>
                   </div>
               )}

               <button 
                   onClick={runBackupVerification}
                   disabled={verificationStatus === 'RUNNING'}
                   className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                       verificationStatus === 'SUCCESS' 
                       ? 'bg-green-600/20 text-green-400 border border-green-500/50 cursor-default'
                       : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                   }`}
               >
                   {verificationStatus === 'RUNNING' ? 'Running Verification...' : verificationStatus === 'SUCCESS' ? 'Verification Passed' : 'Run Backup Verification (RPO Check)'}
               </button>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-slate-800 pb-2">
                    <Clock size={12} /> RECENT_WAL_ACTIVITY
                </div>
                <div className="h-24 overflow-y-auto custom-scrollbar space-y-1 text-green-400/70">
                   {walLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                   ))}
                   <div ref={walEndRef} />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DisasterRecovery;