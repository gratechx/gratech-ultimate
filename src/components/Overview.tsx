import React, { useState } from 'react';
import { LayoutDashboard, CheckCircle2, ShieldCheck, Globe, ClipboardList, CalendarClock, Download, X, ArrowRight, Circle, Play, Briefcase, Handshake } from 'lucide-react';
import { GRA_TECH_DATA } from '../data';
import Compute from './Compute';
import AIServices from './AIServices';
import NetworkStorage from './NetworkStorage';
import DownloadsHub from './DownloadsHub';

const Overview: React.FC = () => {
  const { account } = GRA_TECH_DATA;
  const [showLaunchControl, setShowLaunchControl] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'timeline'>('checklist');

  const checklistItems = [
    { id: 1, label: 'Infrastructure as Code (Terraform) - Azure', status: 'pass', authority: 'DevOps' },
    { id: 2, label: 'CI/CD Pipeline (Docker/AKS)', status: 'pass', authority: 'GitHub Actions' },
    { id: 3, label: 'IBM Partner Plus Application', status: 'pass', authority: 'IBM' },
    { id: 4, label: 'Odoo Strategic Partnership (Saudi Agent)', status: 'action', authority: 'Business' },
    { id: 5, label: 'Data Residency Check (Dammam)', status: 'pass', authority: 'NCA-ECC' },
    { id: 6, label: 'Load Testing (10k RPS)', status: 'pending', authority: 'QA' },
  ];

  const timelineEvents = [
    { week: 'W1', title: 'Infrastructure Build', desc: 'Terraform Validated, Azure Resources Provisioned', status: 'done' },
    { week: 'W2', title: 'Strategic Partnerships', desc: 'IBM Approved, Odoo Negotiation', status: 'current' },
    { week: 'W3', title: 'Pilot Deployment', desc: 'MCIT Onboarding, Live Traffic', status: 'pending' },
    { week: 'W4', title: 'Commercial Launch', desc: 'SaaS Billing, Enterprise Scale', status: 'pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in pb-20 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <LayoutDashboard className="text-starlight-cyan" size={32} />
             <h1 className="text-3xl font-light text-white">
               <span className="font-bold">System Overview</span>
             </h1>
          </div>
          <p className="text-gray-400">
             {account.name} • <span className="text-green-500">Live Infrastructure Monitoring</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowLaunchControl(true)}
                className="flex items-center gap-2 px-4 py-2 bg-nexus-primary/20 hover:bg-nexus-primary/30 border border-nexus-primary/50 text-nexus-primary rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]"
            >
                <ClipboardList size={18} /> MISSION CONTROL
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <Globe size={16} className="text-purple-400" />
                <span className="text-sm font-bold text-purple-200">REGION: MULTI-CLOUD (KSA)</span>
            </div>
        </div>
      </div>

      {/* Pilot Readiness Banner */}
      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-900/10">
          <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-full text-slate-900 shadow-lg shadow-blue-500/20 animate-pulse-slow">
                  <Handshake size={32} />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      PARTNERSHIP ECOSYSTEM ACTIVE
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wide">IBM + Odoo</span>
                  </h2>
                  <p className="text-blue-100/70 mt-1 max-w-2xl">
                      IBM Partner Plus status is <strong>APPROVED</strong>. Odoo Agency negotiation is <strong>PENDING</strong> (Action Required).
                      Infrastructure code (Terraform) is validated and ready for Azure deployment.
                  </p>
              </div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[200px]">
              <div className="flex items-center gap-2 text-sm text-blue-300 font-bold">
                  <ShieldCheck size={16} /> READINESS SCORE
              </div>
              <div className="text-4xl font-mono text-white font-bold">98%</div>
              <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[98%] shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
              </div>
          </div>
      </div>

      {/* Compute Section */}
      <div>
         <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-starlight-cyan rounded-full"></span>
            Compute Resources
         </h2>
         <Compute />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Services & Storage */}
         <div className="space-y-8">
            <div>
               <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-nebula-purple rounded-full"></span>
                  AI Microservices
               </h2>
               <AIServices />
            </div>
            <div>
               <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                  Storage Fabric
               </h2>
               <NetworkStorage />
            </div>
         </div>

         {/* Downloads & Logs */}
         <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden h-full">
             <DownloadsHub />
         </div>
      </div>

      {/* Launch Control Modal */}
      {showLaunchControl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-[#0b101b] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-900 to-[#0b101b]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-nexus-primary text-white rounded-lg">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">MISSION CONTROL</h2>
                            <p className="text-xs text-nexus-primary font-mono tracking-widest">PHASE: PARTNERSHIP & DEPLOYMENT</p>
                        </div>
                    </div>
                    <button onClick={() => setShowLaunchControl(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('checklist')}
                        className={`flex-1 py-4 text-sm font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'checklist' ? 'border-nexus-primary text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} /> VALIDATION CHECKLIST
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('timeline')}
                        className={`flex-1 py-4 text-sm font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'timeline' ? 'border-nexus-primary text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <CalendarClock size={16} /> EXECUTION TIMELINE
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-900/50">
                    
                    {activeTab === 'checklist' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-bold">Go/No-Go Criteria</h3>
                                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded">
                                    Status: 4/6 PASSED
                                </span>
                            </div>
                            <div className="grid gap-3">
                                {checklistItems.map(item => (
                                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                        item.status === 'pass' ? 'bg-green-900/10 border-green-500/30' : 
                                        item.status === 'action' ? 'bg-blue-900/10 border-blue-500/50' :
                                        'bg-slate-800/50 border-slate-700'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                                item.status === 'pass' ? 'bg-green-500 border-green-400 text-slate-900' : 
                                                item.status === 'action' ? 'bg-blue-500 border-blue-400 text-white animate-pulse' :
                                                'bg-transparent border-slate-500 text-slate-500'
                                            }`}>
                                                {item.status === 'pass' && <CheckCircle2 size={14} />}
                                                {item.status === 'action' && <Briefcase size={12} />}
                                            </div>
                                            <div>
                                                <div className={`font-medium ${item.status === 'pass' ? 'text-green-100' : 'text-gray-400'}`}>{item.label}</div>
                                                <div className="text-[10px] text-gray-500 font-mono uppercase">Authority: {item.authority}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold uppercase tracking-wider">
                                            {item.status === 'pass' ? <span className="text-green-400">VERIFIED</span> : 
                                             item.status === 'action' ? <span className="text-blue-400">ACTION REQ</span> :
                                             <span className="text-yellow-500">PENDING</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-700"></div>
                            <div className="space-y-8">
                                {timelineEvents.map((event, i) => (
                                    <div key={i} className="flex gap-6 relative">
                                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 shrink-0 ${
                                            event.status === 'done' ? 'bg-slate-900 border-green-500 text-green-500' : 
                                            event.status === 'current' ? 'bg-nexus-primary border-slate-900 text-white shadow-glow' : 
                                            'bg-slate-900 border-slate-700 text-gray-600'
                                        }`}>
                                            <span className="text-xs font-bold">{event.week}</span>
                                        </div>
                                        <div className={`flex-1 p-4 rounded-xl border ${
                                            event.status === 'current' ? 'bg-nexus-primary/5 border-nexus-primary/30' : 'bg-slate-800/30 border-slate-700'
                                        }`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`font-bold ${event.status === 'current' ? 'text-white' : 'text-gray-300'}`}>{event.title}</h4>
                                                {event.status === 'current' && <span className="text-[10px] bg-nexus-primary text-white px-2 py-0.5 rounded animate-pulse">ACTIVE PHASE</span>}
                                                {event.status === 'done' && <span className="text-[10px] text-green-500 flex items-center gap-1"><CheckCircle2 size={10} /> DONE</span>}
                                            </div>
                                            <p className="text-sm text-gray-500">{event.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-[#0b101b] flex justify-between items-center">
                    <button className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                        <Download size={16} /> Export Strategy Report (PDF)
                    </button>
                    <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all hover:scale-105">
                        <Play size={18} fill="currentColor" /> DEPLOY TO AZURE
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Overview;