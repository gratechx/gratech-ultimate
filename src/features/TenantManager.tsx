import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Shield, Database, Lock, Globe, Server, Key, 
  AlertCircle, CheckCircle2, Cloud, UserCheck, Plus, X, 
  ChevronRight, Terminal, Loader2, Save 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Tenant } from '../types';

// Mock additional tenants for the list view
const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-root-001',
    createdAt: new Date(),
    code: 'GRATECH-HQ',
    name_en: 'GraTech Headquarters',
    name_ar: 'شركة جراتك',
    name: { en: 'GraTech Headquarters', ar: 'شركة جراتك' },
    region: 'riyadh',
    tier: 'sovereign',
    limits: { storageGB: 10000, apiCalls: 1000000, users: 50 },
    security: { encryptionKeyId: 'kv-gratech-root-01', isActive: true, complianceLevel: 'sovereign' },
    features: { aiops: true, monitoring: true, multiRegion: true },
    max_storage_gb: 10000,
    max_api_calls: 1000000,
    encryption_key_id: 'kv-gratech-root-01',
    is_active: true
  },
  {
    id: 't-moh-002',
    createdAt: new Date(),
    code: 'MOH-SA',
    name_en: 'Ministry of Health',
    name_ar: 'وزارة الصحة',
    name: { en: 'Ministry of Health', ar: 'وزارة الصحة' },
    region: 'riyadh',
    tier: 'enterprise',
    limits: { storageGB: 5000, apiCalls: 500000, users: 1000 },
    security: { encryptionKeyId: 'kv-moh-sa-02', isActive: true, complianceLevel: 'advanced' },
    features: { aiops: true, monitoring: true, multiRegion: false },
    max_storage_gb: 5000,
    max_api_calls: 500000,
    encryption_key_id: 'kv-moh-sa-02',
    is_active: true
  },
  {
    id: 't-mcit-005',
    createdAt: new Date(),
    code: 'MCIT-GOV',
    name_en: 'Ministry of Communications',
    name_ar: 'وزارة الاتصالات',
    name: { en: 'Ministry of Communications', ar: 'وزارة الاتصالات' },
    region: 'riyadh',
    tier: 'sovereign',
    limits: { storageGB: 15000, apiCalls: 3000000, users: 2000 },
    security: { encryptionKeyId: 'kv-mcit-05', isActive: true, complianceLevel: 'sovereign' },
    features: { aiops: true, monitoring: true, multiRegion: true },
    max_storage_gb: 15000,
    max_api_calls: 3000000,
    encryption_key_id: 'kv-mcit-05',
    is_active: true
  }
];

const TenantManager: React.FC = () => {
  const { checkPermission } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [showWizard, setShowWizard] = useState(false);
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    code: '',
    region: 'riyadh',
    tier: 'standard',
    admin_email: ''
  });
  const [provisioningLogs, setProvisioningLogs] = useState<string[]>([]);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [provisioningLogs]);

  if (!checkPermission('ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-slate-900 border border-red-900/50 p-10 rounded-2xl max-w-md">
           <Lock size={48} className="text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
           <p className="text-gray-400">
             Multi-Tenancy Configuration is restricted to Platform Administrators.
           </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startProvisioning = async () => {
    setIsProvisioning(true);
    setProvisioningLogs(['Initializing Runbook 5: Tenant Onboarding...']);
    
    const steps = [
      { msg: `> Creating Namespace: tenant-${formData.code.toLowerCase()}...`, delay: 800 },
      { msg: `> Applying RLS Policies for ${formData.region}...`, delay: 1500 },
      { msg: `> Provisioning Azure Key Vault: kv-${formData.code.toLowerCase()}...`, delay: 2500 },
      { msg: `> Generating Encryption Keys (AES-256)...`, delay: 3500 },
      { msg: `> Mapping Azure AD Group for ${formData.admin_email}...`, delay: 4500 },
      { msg: `> Verifying Sovereignty Compliance...`, delay: 5500 },
      { msg: `✅ SUCCESS: Tenant ${formData.code} is LIVE.`, delay: 6500 }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay - (steps[steps.indexOf(step)-1]?.delay || 0)));
      setProvisioningLogs(prev => [...prev, step.msg]);
    }

    setTimeout(() => {
      const newTenant: Tenant = {
        id: `t-${formData.code.toLowerCase()}-${Date.now().toString().slice(-4)}`,
        createdAt: new Date(),
        code: formData.code,
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        name: { en: formData.name_en, ar: formData.name_ar },
        region: formData.region as any,
        tier: formData.tier as any,
        limits: {
            storageGB: formData.tier === 'sovereign' ? 10000 : 1000,
            apiCalls: formData.tier === 'sovereign' ? 1000000 : 100000,
            users: 50
        },
        security: {
            encryptionKeyId: `kv-${formData.code.toLowerCase()}`,
            isActive: true,
            complianceLevel: formData.tier === 'sovereign' ? 'sovereign' : 'basic'
        },
        features: {
            aiops: true,
            monitoring: true,
            multiRegion: formData.tier === 'sovereign'
        },
        max_storage_gb: formData.tier === 'sovereign' ? 10000 : 1000,
        max_api_calls: formData.tier === 'sovereign' ? 1000000 : 100000,
        encryption_key_id: `kv-${formData.code.toLowerCase()}`,
        is_active: true
      };
      setTenants(prev => [newTenant, ...prev]);
      setIsProvisioning(false);
      setShowWizard(false);
      setStep(1);
      setFormData({ name_en: '', name_ar: '', code: '', region: 'riyadh', tier: 'standard', admin_email: '' });
      setProvisioningLogs([]);
    }, 7000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <Building2 className="text-nexus-primary" size={32} />
             Tenant Management System
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Configure isolation policies, manage data sovereignty, and monitor resource quotas across all government entities.
            Aligned with <span className="text-green-400 font-mono">PDPL Article 10</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-mono">RLS: ENFORCED</span>
           </div>
           <button 
             onClick={() => setShowWizard(true)}
             className="bg-nexus-primary hover:bg-violet-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
           >
              <Plus size={18} /> Onboard Tenant
           </button>
        </div>
      </div>

      {/* Architecture Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* ... (Existing Cards) ... */}
         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Shield size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Lock size={20} /></div>
               <h3 className="text-lg font-bold text-white">Data Isolation</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400">
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" /> PostgreSQL Row-Level Security
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" /> Redis Namespacing
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" /> Container Process Isolation
               </li>
            </ul>
         </div>

         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Key size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Key size={20} /></div>
               <h3 className="text-lg font-bold text-white">Encryption</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400">
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-500" /> Azure Key Vault Integration
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-500" /> Per-Tenant Encryption Keys
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-500" /> AES-256 Data at Rest
               </li>
            </ul>
         </div>

         <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Globe size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Cloud size={20} /></div>
               <h3 className="text-lg font-bold text-white">Sovereignty</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400">
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500" /> Multi-Region Failover
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500" /> Saudi Data Residency
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500" /> Blockchain Audit Trail
               </li>
            </ul>
         </div>
      </div>

      {/* Tenant List */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white text-lg">Registered Tenants</h3>
            <span className="text-xs text-gray-500 font-mono">TOTAL: {tenants.length}</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
               <thead className="bg-black/20 text-gray-200 uppercase font-mono text-xs">
                  <tr>
                     <th className="px-6 py-4 font-medium">Tenant Identity</th>
                     <th className="px-6 py-4 font-medium">Region</th>
                     <th className="px-6 py-4 font-medium">Tier</th>
                     <th className="px-6 py-4 font-medium">Authentication</th>
                     <th className="px-6 py-4 font-medium text-right">Quota Usage</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {tenants.map((tenant) => (
                     <tr key={tenant.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white font-bold">
                                 {tenant.code.substring(0, 2)}
                              </div>
                              <div>
                                 <div className="font-bold text-white">{tenant.name.en}</div>
                                 <div className="text-xs text-nexus-primary">{tenant.name.ar}</div>
                                 <div className="text-[10px] font-mono text-gray-600">{tenant.id}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                              <Globe size={10} /> {tenant.region}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border uppercase ${
                              tenant.tier === 'sovereign' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : 'bg-slate-700/50 text-gray-300 border-slate-600'
                           }`}>
                              {tenant.tier}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                              {tenant.code === 'MCIT-GOV' ? (
                                  <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded w-fit border border-green-500/30">
                                     <UserCheck size={12} /> Azure AD SSO
                                  </div>
                              ) : (
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                     <Lock size={12} /> Standard Auth
                                  </div>
                              )}
                              <div className="text-[10px] font-mono text-gray-600 flex items-center gap-1 mt-1">
                                 <Key size={10} /> {tenant.security.encryptionKeyId}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-mono text-gray-300">
                                 {(Math.random() * 50 + 10).toFixed(1)}% / {tenant.limits.storageGB}GB
                              </span>
                              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-nexus-secondary" style={{ width: '45%' }}></div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Onboarding Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                 <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <Plus className="text-nexus-primary" /> Tenant Onboarding Wizard
                    </h3>
                    <p className="text-xs text-gray-400">Automated Runbook #5 Execution</p>
                 </div>
                 <button onClick={() => !isProvisioning && setShowWizard(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                 </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1">
                 <div className="h-full bg-nexus-primary transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto flex-1">
                 
                 {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">English Name</label>
                              <input 
                                name="name_en"
                                value={formData.name_en}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-nexus-primary outline-none"
                                placeholder="e.g. Ministry of Transport"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Arabic Name</label>
                              <input 
                                name="name_ar"
                                value={formData.name_ar}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-nexus-primary outline-none text-right"
                                placeholder="مثال: وزارة النقل"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tenant Code</label>
                           <input 
                              name="code"
                              value={formData.code}
                              onChange={handleInputChange}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-nexus-primary outline-none"
                              placeholder="e.g. MOT-GOV"
                           />
                           <p className="text-[10px] text-gray-500 mt-1">Used for Namespace and DB Role generation.</p>
                        </div>
                    </div>
                 )}

                 {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Data Region</label>
                              <select 
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-nexus-primary outline-none"
                              >
                                 <option value="riyadh">Riyadh (KSA Central)</option>
                                 <option value="jeddah">Jeddah (KSA West)</option>
                                 <option value="dammam">Dammam (KSA East)</option>
                                 <option value="neom">NEOM (Future)</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Service Tier</label>
                              <select 
                                name="tier"
                                value={formData.tier}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-nexus-primary outline-none"
                              >
                                 <option value="standard">Standard (Shared)</option>
                                 <option value="enterprise">Enterprise (Dedicated)</option>
                                 <option value="sovereign">Sovereign (Air-Gapped)</option>
                              </select>
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Admin Email (Azure AD)</label>
                           <input 
                              name="admin_email"
                              value={formData.admin_email}
                              onChange={handleInputChange}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-nexus-primary outline-none"
                              placeholder="admin@ministry.gov.sa"
                           />
                        </div>
                    </div>
                 )}

                 {step === 3 && (
                    <div className="h-64 bg-black rounded-xl border border-slate-800 p-4 font-mono text-xs flex flex-col relative overflow-hidden">
                        <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-slate-800 pb-2">
                            <Terminal size={12} /> PROVISIONING_LOGS
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                            {provisioningLogs.map((log, i) => (
                                <div key={i} className={log.includes('SUCCESS') ? 'text-green-400 font-bold' : 'text-gray-300'}>
                                    {log}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                        {isProvisioning && (
                            <div className="absolute bottom-4 right-4">
                                <Loader2 className="animate-spin text-nexus-primary" size={24} />
                            </div>
                        )}
                    </div>
                 )}

              </div>

              {/* Footer Controls */}
              <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-slate-900/50">
                 {step < 3 ? (
                    <>
                       {step > 1 && (
                          <button 
                             onClick={() => setStep(step - 1)}
                             className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                          >
                             Back
                          </button>
                       )}
                       <button 
                          onClick={() => setStep(step + 1)}
                          disabled={!formData.code || !formData.name_en}
                          className="bg-nexus-primary hover:bg-violet-600 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                       >
                          Next Step <ChevronRight size={16} />
                       </button>
                    </>
                 ) : (
                    <button 
                       onClick={startProvisioning}
                       disabled={isProvisioning}
                       className={`bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                       {isProvisioning ? 'Provisioning...' : <><Save size={16} /> Execute Runbook</>}
                    </button>
                 )}
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default TenantManager;