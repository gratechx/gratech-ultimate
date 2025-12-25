import React, { useState, useEffect, useRef } from 'react';
import { Activity, Cpu, HardDrive, Globe, ShieldCheck, Zap, Server, AlertCircle, Terminal, Lock, Database, Boxes, Network, Hash, Building2 } from 'lucide-react';
import { logger } from '../services/loggerService';
import { SystemLog } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Monitoring: React.FC = () => {
    const { checkPermission, tenant } = useAuth();
    
    const [cpu, setCpu] = useState(45);
    const [memory, setMemory] = useState(62);
    const [blockHeight, setBlockHeight] = useState(1402394);
    const [peers, setPeers] = useState(12);
    const [history, setHistory] = useState<number[]>(Array(20).fill(50));
    
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const hasAccess = checkPermission('ADMIN');

    useEffect(() => {
        if (!hasAccess) return;

        const unsubscribe = logger.subscribe((newLogs) => {
            setLogs(newLogs);
        });

        const interval = setInterval(() => {
            setCpu(prev => Math.min(100, Math.max(20, prev + (Math.random() * 20 - 10))));
            setMemory(prev => Math.min(100, Math.max(30, prev + (Math.random() * 10 - 5))));
            setBlockHeight(prev => prev + 1);
            setPeers(prev => Math.floor(Math.random() * 3) + 10);
            
            setHistory(prev => {
                const newVal = Math.min(100, Math.max(0, prev[prev.length - 1] + (Math.random() * 30 - 15)));
                return [...prev.slice(1), newVal];
            });
        }, 2000);
        
        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    }, [hasAccess]);

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="bg-slate-900 border border-red-900/50 p-10 rounded-2xl max-w-md">
                    <Lock size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400">
                        Restricted Area. You do not have the required administrative privileges to view system metrics.
                    </p>
                </div>
            </div>
        );
    }

    const StatusCard = ({ title, value, unit, icon, color, subtext }: any) => (
        <div className="bg-nexus-surface/80 border border-nexus-border rounded-xl p-6 relative overflow-hidden group hover:border-nexus-primary/50 transition-all shadow-lg">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                {icon}
            </div>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-slate-800 ${color} bg-opacity-20`}>
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <span className="text-sm text-nexus-gray-400 font-medium uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-nexus-gray-100 font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                <span className="text-xs text-nexus-gray-500 font-bold">{unit}</span>
            </div>
            {subtext && <div className="mt-2 text-xs text-nexus-gray-500 flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`}></div>
                {subtext}
            </div>}
        </div>
    );

    const ServiceHealthRow = ({ name, port, status, latency }: { name: string, port: string, status: string, latency: string }) => (
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:border-nexus-primary/30 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <div>
                    <div className="text-sm font-bold text-white">{name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{port}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-green-400">{status}</div>
                <div className="text-[10px] text-gray-600 font-mono">{latency}</div>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b border-nexus-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-nexus-gray-100 flex items-center gap-3">
                        <Activity className="text-nexus-primary" />
                        GraTech Truth Engine
                    </h2>
                    <p className="text-nexus-gray-400 mt-1">Real-time Infrastructure & Blockchain Telemetry</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <ShieldCheck size={14} className="text-green-400" />
                        <span className="text-green-400 text-sm font-bold tracking-wide">SECURE: IBFT 2.0</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-nexus-gray-500">AUTHORITY</div>
                        <div className="text-sm font-mono text-nexus-secondary">NEXUS COMMAND</div>
                    </div>
                </div>
            </div>

            {/* Tenant Context Banner */}
            {tenant && (
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                             <Building2 size={24} />
                        </div>
                        <div>
                             <div className="text-sm text-gray-400 uppercase tracking-widest font-mono">Viewing Context</div>
                             <div className="text-xl font-bold text-white">{tenant.name_en} <span className="text-gray-500">({tenant.code})</span></div>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-right">
                            <div className="text-xs text-gray-500 font-mono">RLS POLICY</div>
                            <div className="text-sm text-green-400 font-bold flex items-center justify-end gap-1"><Lock size={12} /> ACTIVE</div>
                        </div>
                         <div className="text-right">
                            <div className="text-xs text-gray-500 font-mono">NAMESPACE</div>
                            <div className="text-sm text-purple-400 font-bold flex items-center justify-end gap-1"><Database size={12} /> {tenant.id}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard 
                    title="Ledger Height" 
                    value={blockHeight} 
                    unit="#" 
                    icon={<Hash />} 
                    color="text-nexus-primary" 
                    subtext="Hyperledger Besu"
                />
                <StatusCard 
                    title="Active Peers" 
                    value={peers} 
                    unit="Nodes" 
                    icon={<Network />} 
                    color="text-nexus-secondary" 
                    subtext="Validator Network"
                />
                <StatusCard 
                    title="Inference Load" 
                    value={cpu} 
                    unit="%" 
                    icon={<Cpu />} 
                    color="text-nexus-accent" 
                    subtext="GPU Cluster: Active"
                />
                <StatusCard 
                    title="Memory Usage" 
                    value={memory} 
                    unit="%" 
                    icon={<HardDrive />} 
                    color={memory > 90 ? "text-nexus-error" : "text-green-500"} 
                    subtext="Redis Cache"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-nexus-surface/50 border border-nexus-border rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-nexus-gray-100 flex items-center gap-2">
                            <Zap size={18} className="text-yellow-400" />
                            Live Throughput
                        </h3>
                        <span className="text-xs font-mono text-nexus-gray-500">TPS / 2s INTERVAL</span>
                    </div>
                    <div className="h-64 flex items-end gap-1 relative border-b border-l border-slate-700 p-2">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-slate-500"></div>)}
                        </div>
                        
                        {history.map((h, i) => (
                            <div 
                                key={i} 
                                className="flex-1 bg-gradient-to-t from-nexus-primary/20 to-nexus-primary/80 rounded-t-sm transition-all duration-500 ease-out"
                                style={{ height: `${h}%` }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-nexus-gray-500 font-mono">
                        <span>-40s</span>
                        <span>NOW</span>
                    </div>
                </div>

                <div className="bg-nexus-surface/50 border border-nexus-border rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-nexus-gray-100 mb-6 flex items-center gap-2">
                        <Boxes size={18} className="text-nexus-secondary" />
                        Microservices Status
                    </h3>
                    <div className="space-y-3">
                        <ServiceHealthRow name="api-gateway" port="8000" status="Healthy" latency="24ms" />
                        <ServiceHealthRow name="ai-engine" port="Internal" status="Healthy" latency="42ms" />
                        <ServiceHealthRow name="blockchain-ledger" port="8545" status="Synced" latency="1ms" />
                        <ServiceHealthRow name="postgres-primary" port="5432" status="Healthy" latency="5ms" />
                        <ServiceHealthRow name="redis-broker" port="6379" status="Healthy" latency="<1ms" />
                    </div>
                </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs h-64 overflow-hidden flex flex-col shadow-inner">
                 <div className="flex items-center gap-2 text-nexus-gray-500 mb-2 border-b border-slate-800 pb-2">
                    <Terminal size={14} />
                    <span>IMMUTABLE_AUDIT_LOG</span>
                    <span className="ml-auto flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> LIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                    {logs.length === 0 && <div className="text-gray-600 italic">Listening for events...</div>}
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-3 hover:bg-slate-900/50 p-0.5 rounded group">
                            <span className="text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                            <span className={`shrink-0 w-16 font-bold ${
                                log.level === 'ERROR' ? 'text-red-500' : 
                                log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-400'
                            }`}>{log.level}</span>
                            <span className="text-nexus-gray-400 shrink-0 w-24 truncate">[{log.module}]</span>
                            <span className="text-gray-300 break-all">{log.message}</span>
                            <span className="ml-auto text-slate-700 hidden group-hover:block">0x{Math.random().toString(16).substr(2, 8)}...</span>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    );
};

export default Monitoring;