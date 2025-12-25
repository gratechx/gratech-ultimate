import React, { useState, useEffect } from 'react';
import { 
  LineChart, Activity, AlertTriangle, CheckCircle, Server, 
  Database, Cpu, Lock, Bell, Zap, Brain, Boxes,
  ArrowUpRight, AlertOctagon, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AIOpsConsole: React.FC = () => {
  const { checkPermission } = useAuth();
  
  // Simulated Metrics State
  const [aiLatency, setAiLatency] = useState<number[]>(Array(20).fill(120));
  const [gpuUsage, setGpuUsage] = useState<number[]>(Array(20).fill(45));
  const [tokenRate, setTokenRate] = useState<number[]>(Array(20).fill(500));
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [healthScore, setHealthScore] = useState(99.98);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate Metric Fluctuations
      setAiLatency(prev => [...prev.slice(1), Math.max(80, Math.min(2500, prev[prev.length - 1] + (Math.random() * 100 - 45)))]);
      setGpuUsage(prev => [...prev.slice(1), Math.max(10, Math.min(95, prev[prev.length - 1] + (Math.random() * 20 - 10)))]);
      setTokenRate(prev => [...prev.slice(1), Math.max(100, prev[prev.length - 1] + (Math.random() * 200 - 80))]);

      // 2. Trigger Alerts based on Thresholds (simulating Prometheus Rules)
      const currentLatency = aiLatency[aiLatency.length - 1];
      const currentGpu = gpuUsage[gpuUsage.length - 1];
      
      const newAlerts = [];
      
      // Rule: HighAILatency (> 2000ms)
      if (currentLatency > 2000) {
        newAlerts.push({
          id: 'alert-latency',
          severity: 'warning',
          name: 'HighAILatency',
          desc: `P95 Latency: ${(currentLatency / 1000).toFixed(2)}s (Threshold: 2s)`,
          source: 'ai-engine'
        });
      }

      // Rule: GPUMemoryHigh (> 90%)
      if (currentGpu > 90) {
        newAlerts.push({
          id: 'alert-gpu',
          severity: 'warning',
          name: 'GPUMemoryHigh',
          desc: `GPU-0 Usage: ${currentGpu.toFixed(1)}% (Threshold: 90%)`,
          source: 'ml-ops'
        });
      }

      // Rule: AIModelFailureRate (Random Injection)
      if (Math.random() > 0.98) {
         newAlerts.push({
            id: 'alert-failure',
            severity: 'critical',
            name: 'AIModelFailureRate',
            desc: 'Error rate > 1% (5m window)',
            source: 'ai-engine'
         });
      }

      setActiveAlerts(newAlerts);
      
      // Update Health Score
      setHealthScore(newAlerts.some(a => a.severity === 'critical') ? 98.50 : 99.99);

    }, 2000);

    return () => clearInterval(interval);
  }, [aiLatency, gpuUsage]);

  if (!checkPermission('ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-slate-900 border border-red-900/50 p-10 rounded-2xl max-w-md">
           <Lock size={48} className="text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Restricted Area</h2>
           <p className="text-gray-400">
             AIOps & Observability consoles are restricted to Platform Reliability Engineers.
           </p>
        </div>
      </div>
    );
  }

  const ChartWidget = ({ title, data, color, unit, threshold }: any) => {
      const max = Math.max(...data, threshold * 1.2);
      const min = 0;
      
      return (
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col h-48">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-gray-400 uppercase">{title}</span>
                  <span className={`text-sm font-bold font-mono ${data[data.length-1] > threshold ? 'text-red-400' : 'text-white'}`}>
                      {data[data.length-1].toFixed(0)} {unit}
                  </span>
              </div>
              <div className="flex-1 flex items-end gap-1 relative border-b border-l border-slate-800">
                  {/* Threshold Line */}
                  <div className="absolute w-full border-t border-red-500/30 border-dashed" style={{ bottom: `${(threshold / max) * 100}%` }}></div>
                  
                  {data.map((d: number, i: number) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-t-sm transition-all duration-300 ${d > threshold ? 'bg-red-500' : color}`}
                        style={{ height: `${(d / max) * 100}%` }}
                      ></div>
                  ))}
              </div>
          </div>
      );
  };

  const ServiceStatus = ({ name, status, type }: any) => (
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${status === 'UP' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {type === 'db' ? <Database size={16} /> : type === 'api' ? <Server size={16} /> : <Cpu size={16} />}
              </div>
              <div>
                  <div className="text-sm font-bold text-white">{name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{status === 'UP' ? 'HEALTHY' : 'DEGRADED'}</div>
              </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${status === 'UP' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
      </div>
  );

  const hasCriticalAlerts = activeAlerts.some(a => a.severity === 'critical');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Prominent Critical Alert Banner */}
      {hasCriticalAlerts && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white px-6 py-3 flex items-center justify-between shadow-2xl animate-pulse">
            <div className="flex items-center gap-3">
                <AlertOctagon size={24} className="animate-bounce" />
                <div>
                    <h3 className="font-bold text-sm tracking-widest uppercase">CRITICAL SYSTEM FAILURE DETECTED</h3>
                    <p className="text-xs text-red-100">Immediate action required. Automated remediation protocols engaged.</p>
                </div>
            </div>
            <button className="bg-white text-red-600 px-4 py-1.5 rounded font-bold text-xs uppercase hover:bg-red-50 transition-colors">
                ACKNOWLEDGE
            </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <LineChart className="text-nexus-secondary" size={32} />
             AIOps Neural Console
          </h2>
          <p className="text-gray-400 mt-2">
            Unified Observability • Prometheus/Grafana Integrated • Auto-Remediation Active
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
               <div className="text-xs text-gray-500 font-mono">GLOBAL AVAILABILITY</div>
               <div className={`text-2xl font-bold font-mono ${healthScore > 99.9 ? 'text-green-400' : 'text-yellow-400'}`}>
                   {healthScore}%
               </div>
           </div>
           <div className="h-10 w-px bg-slate-700"></div>
           <div className="text-right">
               <div className="text-xs text-gray-500 font-mono">ACTIVE ALERTS</div>
               <div className={`text-2xl font-bold font-mono ${activeAlerts.length > 0 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
                   {activeAlerts.length}
               </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visualization Column */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Grafana-style Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ChartWidget 
                    title="AI Inference Latency (P95)" 
                    data={aiLatency} 
                    color="bg-nexus-secondary" 
                    unit="ms" 
                    threshold={2000} 
                  />
                  <ChartWidget 
                    title="GPU Memory Usage (A100)" 
                    data={gpuUsage} 
                    color="bg-nexus-accent" 
                    unit="%" 
                    threshold={90} 
                  />
              </div>

              {/* AIOps Insights (RCA) */}
              <div className="bg-slate-900 border border-nexus-border rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 text-nexus-primary">
                      <Brain size={20} />
                      <h3 className="font-bold text-lg">Automated Root Cause Analysis (RCA)</h3>
                  </div>
                  
                  {activeAlerts.length > 0 ? (
                      <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <AlertOctagon className="text-red-400 mt-1" size={20} />
                              <div>
                                  <h4 className="text-sm font-bold text-red-300">Correlation Detected</h4>
                                  <p className="text-xs text-red-200/70 mt-1">
                                      High AI Latency is strongly correlated (0.94) with GPU Memory Saturation on Node-03.
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                      <button className="text-[10px] bg-red-500 text-white px-2 py-1 rounded font-bold hover:bg-red-400 transition-colors">
                                          AUTO-SCALE NODE
                                      </button>
                                      <button className="text-[10px] bg-slate-800 text-gray-300 px-2 py-1 rounded border border-slate-700 hover:text-white transition-colors">
                                          VIEW LOGS
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center h-24 text-gray-500 gap-2">
                          <CheckCircle size={20} className="text-green-500" />
                          <span>System Operating Within Baselines</span>
                      </div>
                  )}
              </div>

              {/* Service Mesh Health */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Boxes size={18} className="text-nexus-gray-400" /> Service Mesh Topology
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <ServiceStatus name="API Gateway" status="UP" type="api" />
                      <ServiceStatus name="AI Engine" status={aiLatency[aiLatency.length-1] > 2000 ? 'DEGRADED' : 'UP'} type="ai" />
                      <ServiceStatus name="Postgres Primary" status="UP" type="db" />
                      <ServiceStatus name="Redis Cache" status="UP" type="db" />
                      <ServiceStatus name="Blockchain Node" status="UP" type="db" />
                      <ServiceStatus name="Prometheus" status="UP" type="api" />
                  </div>
              </div>
          </div>

          {/* Alert Feed Column */}
          <div className="space-y-6">
              <div className={`bg-slate-950 border rounded-xl p-4 h-full flex flex-col transition-colors ${hasCriticalAlerts ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-white font-bold">
                          <Bell size={16} className={hasCriticalAlerts ? "text-red-500 animate-swing" : "text-yellow-500"} />
                          <span>Alert Manager</span>
                      </div>
                      <span className="text-[10px] text-gray-500 bg-slate-900 px-2 py-1 rounded">PROMETHEUS STREAM</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                      {activeAlerts.length === 0 && (
                          <div className="text-center py-10 text-gray-600 italic text-sm">
                              No active alerts.
                          </div>
                      )}
                      {activeAlerts.map((alert, i) => (
                          <div key={i} className={`p-3 rounded-lg border flex flex-col gap-1 animate-in slide-in-from-right-2 ${
                              alert.severity === 'critical' 
                              ? 'bg-red-900/20 border-red-500/50' 
                              : 'bg-yellow-900/10 border-yellow-500/30'
                          }`}>
                              <div className="flex justify-between items-start">
                                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${
                                      alert.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-slate-900'
                                  }`}>
                                      {alert.severity}
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-mono">NOW</span>
                              </div>
                              <div className={`font-bold text-sm ${alert.severity === 'critical' ? 'text-red-300' : 'text-yellow-200'}`}>
                                  {alert.name}
                              </div>
                              <div className="text-xs text-gray-400 break-words">{alert.desc}</div>
                              <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                  <Server size={10} /> Source: {alert.source}
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold rounded transition-colors flex items-center justify-center gap-2">
                      <RefreshCw size={12} /> Sync Rules
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AIOpsConsole;