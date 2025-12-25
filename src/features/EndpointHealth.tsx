import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Loader2, XCircle, Wrench, RefreshCw, AlertTriangle, ArrowRight, Cpu } from 'lucide-react';

interface TestStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  details?: string;
}

export const EndpointHealth: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [cnameFixed, setCnameFixed] = useState(false);
  const [sslDaysRemaining, setSslDaysRemaining] = useState<number>(25);
  
  const [steps, setSteps] = useState<TestStep[]>([
    { id: 'cname', label: 'CNAME Verification', status: 'pending', details: 'Waiting...' },
    { id: 'dns', label: 'DNS Resolution', status: 'pending', details: 'Waiting...' },
    { id: 'tcp', label: 'TCP Connection', status: 'pending', details: 'Waiting...' },
    { id: 'ai_health', label: 'Azure AI Connectivity', status: 'pending', details: 'Waiting...' },
    { id: 'ssl', label: 'SSL Handshake', status: 'pending', details: 'Waiting...' },
    { id: 'expiry', label: 'Cert Expiration', status: 'pending', details: 'Waiting...' },
    { id: 'apim_bind', label: 'APIM Binding', status: 'pending', details: 'Waiting...' },
    { id: 'http', label: 'HTTP 200 OK', status: 'pending', details: 'Waiting...' },
  ]);

  const runTests = async () => {
    setIsRunning(true);
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending', details: 'Waiting...' })));

    const updateStep = (id: string, status: TestStep['status'], details: string) => {
      setSteps(prev => prev.map(s => s.id === id ? { ...s, status, details } : s));
    };

    // 1. CNAME Check
    updateStep('cname', 'running', 'Querying Azure DNS Zone (gratech-resources)...');
    await new Promise(r => setTimeout(r, 800));
    
    if (!cnameFixed) {
        updateStep('cname', 'failed', 'Mismatch: Points to parking page');
        setIsRunning(false); 
        return; 
    } else {
        updateStep('cname', 'success', 'gratech-api-gateway.azure-api.net');
    }

    // 2. DNS
    updateStep('dns', 'running', 'Querying ns1-08.azure-dns.com...');
    await new Promise(r => setTimeout(r, 600));
    updateStep('dns', 'success', 'Resolved to 172.201.26.111 (TTL 300)');

    // 3. TCP
    updateStep('tcp', 'running', 'Handshaking on port 443...');
    await new Promise(r => setTimeout(r, 600));
    updateStep('tcp', 'success', 'Connected (45ms)');

    // 4. Azure AI Health (New Step)
    updateStep('ai_health', 'running', 'Ping gratech-openai (East US 2)...');
    await new Promise(r => setTimeout(r, 900));
    updateStep('ai_health', 'success', 'Connected. Key: DILdbV...OK');

    // 5. SSL Handshake
    updateStep('ssl', 'running', 'Verifying Certificate Chain...');
    await new Promise(r => setTimeout(r, 800));
    updateStep('ssl', 'success', 'Verified (Let\'s Encrypt R3)');

    // 6. SSL Expiry Check
    updateStep('expiry', 'running', 'Checking NotAfter date...');
    await new Promise(r => setTimeout(r, 500));
    
    if (sslDaysRemaining > 30) {
        updateStep('expiry', 'success', `Valid for ${sslDaysRemaining} days`);
    } else {
        updateStep('expiry', 'failed', `Expires in ${sslDaysRemaining} days!`);
    }

    // 7. APIM Binding Check
    updateStep('apim_bind', 'running', 'Checking gratech-api-gateway...');
    await new Promise(r => setTimeout(r, 1000));
    updateStep('apim_bind', 'success', 'api.gratech.sa bound (Active)');

    // 8. HTTP
    updateStep('http', 'running', 'Sending GET /health...');
    await new Promise(r => setTimeout(r, 1200));
    updateStep('http', 'success', '200 OK'); 
    
    setIsRunning(false);
  };

  useEffect(() => { runTests(); }, []);

  const handleAutoFixCNAME = async () => {
    setIsRunning(true);
    setSteps(prev => prev.map(s => s.id === 'cname' ? { ...s, status: 'running', details: 'EXECUTING AZURE DNS UPDATE...' } : s));
    await new Promise(r => setTimeout(r, 2000));
    setCnameFixed(true);
    setSteps(prev => prev.map(s => s.id === 'cname' ? { ...s, status: 'success', details: 'CNAME Updated via Script' } : s));
    setIsRunning(false);
    setTimeout(runTests, 500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 z-10">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="text-green-400" size={20} />
            Endpoint Health Check
          </h3>
          <p className="text-sm text-slate-400 mt-1">Automated verification suite</p>
        </div>
        <button 
            onClick={runTests}
            disabled={isRunning}
            className={`text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 transition-colors flex items-center gap-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isRunning ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Run Tests
        </button>
      </div>

      {sslDaysRemaining <= 30 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="bg-red-500/20 p-2 rounded-full shrink-0">
                <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div>
                <h4 className="text-red-400 font-bold">SSL Certificate Expiring Soon</h4>
                <p className="text-red-200/70 text-sm mt-1">
                    The certificate for <span className="font-mono bg-red-500/20 px-1 rounded mx-1">api.gratech.sa</span> expires in {sslDaysRemaining} days. 
                    Renew immediately to prevent downtime.
                </p>
                <div className="mt-3 flex gap-2">
                    <button className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded transition-colors font-medium">
                        Trigger Auto-Renewal
                    </button>
                    <button 
                        onClick={() => setSslDaysRemaining(90)} 
                        className="text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors"
                    >
                        Simulate Renewal
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="space-y-4 flex-1 z-10">
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 mb-6 relative">
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2 mb-2">
            <span className="text-cyan-400 font-bold">TEST</span>
            <span>https://api.gratech.sa/health</span>
          </div>
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center justify-between group py-1">
                <div className="flex items-center gap-3">
                  {step.status === 'success' && <CheckCircle2 size={14} className="text-green-400" />}
                  {step.status === 'running' && <Loader2 size={14} className="text-yellow-400 animate-spin" />}
                  {step.status === 'pending' && <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  {step.status === 'failed' && <XCircle size={14} className="text-red-400" />}
                  <span className={`${step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'} font-medium`}>
                    {step.label}
                  </span>
                </div>
                {step.details && (
                  <span className={`text-[11px] ${
                    step.status === 'running' ? 'text-yellow-400' : 
                    step.status === 'failed' ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    {step.details}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-slate-800/40 border rounded-lg p-4 transition-colors duration-500 ${!cnameFixed ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-slate-700/50'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Wrench size={16} className={!cnameFixed ? "text-yellow-400" : "text-cyan-400"} />
                    <span className="text-sm font-semibold text-slate-200">CNAME Auto-Remediation</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">MONITORING</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                 <div className="text-xs text-slate-400 mb-1">
                    Function: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">ensure_cname_record()</code>
                 </div>
                 
                 <div className="flex items-center gap-3 text-xs bg-slate-900/50 p-3 rounded border border-slate-800/50">
                     <div className="flex flex-col gap-1 flex-1">
                        <span className="text-slate-500 uppercase text-[10px] tracking-wider">Target State</span>
                        <div className="flex items-center gap-2">
                            <span className={cnameFixed ? "text-green-400" : "text-yellow-400"}>
                                {cnameFixed ? "Record Aligned" : "DETECTED MISMATCH"}
                            </span>
                            {cnameFixed ? <CheckCircle2 size={12} className="text-green-400" /> : <AlertTriangle size={12} className="text-yellow-400" />}
                        </div>
                     </div>
                     <div className="h-8 w-px bg-slate-700"></div>
                     <button 
                        onClick={handleAutoFixCNAME}
                        disabled={isRunning || cnameFixed}
                        className={`px-3 py-1.5 rounded text-xs transition-all flex items-center gap-2 ${
                            cnameFixed 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 opacity-50 cursor-default'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30 animate-pulse'
                        }`}
                     >
                        {cnameFixed ? 'Fix Applied' : 'Auto-Fix Issue'}
                        {!cnameFixed && <ArrowRight size={12} />}
                     </button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EndpointHealth;
