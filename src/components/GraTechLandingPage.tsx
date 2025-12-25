import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Cpu, Globe, Zap } from 'lucide-react';

const GraTechLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterApp = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Content */}
      <div className="relative z-10 space-y-8 max-w-3xl">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-sm font-mono tracking-wider">
          <ShieldCheck size={16} className="animate-pulse" />
          <span>SYSTEMS ONLINE</span>
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-200 to-cyan-400 tracking-tight">
            GRATECH
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 font-light tracking-wide">
            السيادة الرقمية السعودية
          </p>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Sovereign AI Platform - Multi-Model Intelligence - Enterprise Ready
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-sm text-slate-300">AI Chat</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Cpu className="w-6 h-6 text-violet-400" />
            <span className="text-sm text-slate-300">6 Models</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Globe className="w-6 h-6 text-teal-400" />
            <span className="text-sm text-slate-300">Saudi Cloud</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Zap className="w-6 h-6 text-amber-400" />
            <span className="text-sm text-slate-300">Real-time</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnterApp}
          className="group relative px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg tracking-wider rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_60px_rgba(20,184,166,0.6)]"
        >
          <span className="relative z-10 flex items-center gap-3">
            دخول لوحة التحكم
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </span>
        </button>

        {/* Footer */}
        <div className="pt-8 text-slate-500 text-sm">
          <p>Built by <span className="text-teal-400">Sulaiman Alshammari</span> - @Grar00t</p>
          <p className="mt-1">4000+ Hours of Development</p>
        </div>
      </div>
    </div>
  );
};

export default GraTechLandingPage;
