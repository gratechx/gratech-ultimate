import React from 'react';
import { View, NavigationItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MessageSquare, Image, Video, Mic, BarChart, MapPin, Volume2, 
  Cpu, Layers, Zap, BookOpen, Activity, DollarSign, 
  LogOut, Sun, Moon, ShieldCheck, ChevronRight, Settings,
  GraduationCap, Sparkles, Command, HardDrive, LayoutDashboard, Terminal,
  Building2, Globe, Lock, ShieldAlert, LineChart, GitPullRequest
} from 'lucide-react';

interface LayoutProps {
  currentView: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}

const NAVIGATION_GROUPS = [
  {
    id: 'core',
    title: 'Cortex',
    icon: <Cpu size={14} />,
    items: [
      { 
        id: View.OVERVIEW, 
        label: 'System Overview', 
        icon: <LayoutDashboard size={18} />, 
        restricted: false,
        description: 'Dashboard'
      },
      { 
        id: View.CHAT, 
        label: 'Comet Chat', 
        icon: <MessageSquare size={18} />, 
        restricted: false,
        description: 'Reasoning Engine'
      },
      { 
        id: View.AUDIO_LIVE, 
        label: 'Live Link', 
        icon: <Mic size={18} />, 
        restricted: false,
        description: 'Real-time Uplink'
      },
    ]
  },
  {
    id: 'creation',
    title: 'Fabrication',
    icon: <Layers size={14} />,
    items: [
      { 
        id: View.CODE_GEN, 
        label: 'Code Studio', 
        icon: <Terminal size={18} />, 
        restricted: false,
        description: 'Code Generation'
      },
      { 
        id: View.IMAGE_GEN, 
        label: 'Vision', 
        icon: <Image size={18} />, 
        restricted: false,
        description: 'Image Synthesis'
      },
      { 
        id: View.VIDEO_GEN, 
        label: 'Motion', 
        icon: <Video size={18} />, 
        restricted: false,
        description: 'Veo Video Generation'
      },
      { 
        id: View.TTS, 
        label: 'Voice', 
        icon: <Volume2 size={18} />, 
        restricted: false,
        description: 'Speech Synthesis'
      },
    ]
  },
  {
    id: 'intelligence',
    title: 'Data Grid',
    icon: <Zap size={14} />,
    items: [
      { 
        id: View.ANALYSIS, 
        label: 'Analysis', 
        icon: <BarChart size={18} />, 
        restricted: false,
        description: 'Deep Insights'
      },
      { 
        id: View.GROUNDING, 
        label: 'Search', 
        icon: <MapPin size={18} />, 
        restricted: false,
        description: 'World Knowledge'
      },
      { 
        id: View.FILES, 
        label: 'Data Vault', 
        icon: <HardDrive size={18} />, 
        restricted: false,
        description: 'File System'
      },
    ]
  },
  {
    id: 'ops',
    title: 'System',
    icon: <Settings size={14} />,
    items: [
      { 
        id: View.AIOPS, 
        label: 'AIOps Console', 
        icon: <LineChart size={18} />, 
        restricted: true,
        description: 'Prometheus/Grafana'
      },
      { 
        id: View.MODEL_REGISTRY, 
        label: 'Neural Governance', 
        icon: <GitPullRequest size={18} />, 
        restricted: true,
        description: 'Model Versioning'
      },
      { 
        id: View.TENANTS, 
        label: 'Tenant Manager', 
        icon: <Building2 size={18} />, 
        restricted: true,
        description: 'Multi-Tenancy'
      },
      { 
        id: View.DISASTER_RECOVERY, 
        label: 'Resilience (DR/BC)', 
        icon: <ShieldAlert size={18} />, 
        restricted: true,
        description: 'Disaster Recovery'
      },
      { 
        id: View.MONITORING, 
        label: 'Telemetry', 
        icon: <Activity size={18} />, 
        restricted: true,
        description: 'System Status'
      },
      { 
        id: View.BILLING, 
        label: 'Finance', 
        icon: <DollarSign size={18} />, 
        restricted: true,
        description: 'Billing'
      },
      { 
        id: View.ACADEMY, 
        label: 'Academy', 
        icon: <GraduationCap size={18} />, 
        restricted: false,
        description: 'Training'
      },
    ]
  }
];

const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  const { user, tenant, logout, checkPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const NavigationButton: React.FC<{ item: NavigationItem; index: number }> = ({ item, index }) => {
    const isActive = currentView === item.id;
    return (
      <button
        onClick={() => onViewChange(item.id)}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm w-full text-left mb-1
          ${isActive 
            ? 'bg-nexus-primary/10 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)] border border-nexus-primary/20' 
            : 'text-nexus-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
      >
        <span className={`transition-all duration-300 ${isActive ? 'text-nexus-primary scale-110' : 'group-hover:text-nexus-primary'}`}>
          {item.icon}
        </span>
        
        <span className="flex-1">{item.label}</span>

        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary shadow-[0_0_8px_#7c3aed]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <aside className="w-72 glass-panel flex flex-col z-30 relative transition-all duration-300">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-nexus-primary to-nexus-secondary rounded-xl shadow-glow">
              <Command className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-wide text-white">COMET</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-nexus-secondary animate-pulse"></span>
                <span className="text-[10px] text-nexus-gray-400 font-mono tracking-widest uppercase">OS v2.4</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
          {NAVIGATION_GROUPS.map((group) => {
            const authorizedItems = group.items.filter(item => !item.restricted || checkPermission('ADMIN'));
            if (authorizedItems.length === 0) return null;

            return (
              <div key={group.id} className="animate-in fade-in duration-500">
                <div className="flex items-center gap-2 px-3 mb-2">
                  <span className="text-nexus-gray-500">{group.icon}</span>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-nexus-gray-500 font-mono font-bold">
                    {group.title}
                  </h3>
                </div>
                <div>
                  {authorizedItems.map((item, index) => (
                    <NavigationButton key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {tenant && (
          <div className="px-4 py-2">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <div className="text-[10px] text-nexus-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Building2 size={10} /> TENANT CONTEXT
              </div>
              <div className="text-xs font-bold text-white truncate">{tenant.name_en}</div>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] bg-nexus-primary/20 text-nexus-primary px-1.5 py-0.5 rounded border border-nexus-primary/30 flex items-center gap-1">
                   <Globe size={8} /> {tenant.region.toUpperCase()}
                 </span>
                 <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                   <Lock size={8} /> RLS
                 </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-nexus-border bg-black/20">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
             <div className="flex items-center gap-3 min-w-0">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-primary to-purple-900 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 group-hover:ring-nexus-primary/50 transition-all">
                  {user?.name.charAt(0)}
               </div>
               <div className="min-w-0">
                 <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                 <div className="text-[10px] text-nexus-gray-400 font-mono">{user?.role}</div>
               </div>
             </div>
             <button onClick={logout} className="p-2 hover:text-nexus-accent transition-colors">
               <LogOut size={16} />
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-nexus-bg min-w-0">
         <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
            {children}
         </div>
      </main>
    </div>
  );
};

export default Layout;