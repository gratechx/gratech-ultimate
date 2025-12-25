import React from 'react';
import { CreditCard, DollarSign, Download, Calendar, CheckCircle, FileText, Server, AlertOctagon, Briefcase, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../services/loggerService';

const Billing: React.FC = () => {
    const { checkPermission } = useAuth();
    
    const billingAccounts = [
        {
            id: '013AA4-EDF591-58A3A2', 
            displayName: 'My Billing Account',
            linkedProject: 'gen-lang-client-0303535965',
            plan: 'Google Cloud Platform (Enterprise)',
            usage: 85,
            cost: 2450.00,
            status: 'Active',
            isOpen: true,
            nextBilling: '2025-04-01'
        },
        {
            id: '01010C-4C0C8F-FBB773', 
            displayName: 'cntxt-online-7050426415-ghala-raffa-company',
            linkedProject: 'Multi-Project',
            plan: 'Standard Tier',
            usage: 45,
            cost: 850.00,
            status: 'Active',
            isOpen: true,
            nextBilling: '2025-04-15'
        },
        {
            id: '015E13-3F184A-B8547D', // Closed Account
            displayName: 'Gratech Main Billing',
            linkedProject: 'Archived',
            plan: 'Legacy',
            usage: 0,
            cost: 0.00,
            status: 'Closed',
            isOpen: false,
            nextBilling: '-'
        },
        {
            id: '019643-FB834C-BF727F', // Closed Account
            displayName: 'Firebase Payment',
            linkedProject: 'firebase-prod',
            plan: 'Blaze',
            usage: 0,
            cost: 0.00,
            status: 'Closed',
            isOpen: false,
            nextBilling: '-'
        }
    ];

    const transactions = [
        {
            date: 'Today',
            description: 'Outstanding Balance Payment (Reinstatement)',
            method: 'Visa •••• 8746',
            amount: 38.70,
            status: 'Success'
        },
        {
            date: '2025-02-28',
            description: 'Monthly Compute Engine Usage',
            method: 'Visa •••• 8746',
            amount: 2450.00,
            status: 'Success'
        }
    ];

    if (!checkPermission('ADMIN')) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="bg-slate-900 border border-red-900/50 p-10 rounded-2xl max-w-md">
                    <Lock size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400">
                        Financial data is restricted to authorized administrators only.
                    </p>
                </div>
            </div>
        );
    }

    const handleDownloadInvoice = (id: string) => {
        logger.info(`Downloading invoice for billing ID ${id}`, "BillingService");
        alert(`Downloading invoice PDF for ${id}...`);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6 flex items-start gap-4 shadow-xl shadow-green-900/20">
                <div className="p-3 bg-green-500 rounded-full text-slate-900 shrink-0 mt-1 animate-pulse">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <h3 className="text-green-400 font-bold text-xl">Account Reinstated & Fully Operational</h3>
                    <p className="text-green-100/80 mt-2 text-lg">
                        Billing account <strong>013AA4-EDF591-58A3A2</strong> is <span className="text-white font-bold underline">ACTIVE</span>. 
                        You have full access to deploy, scale, and succeed. No blocks detected.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded bg-green-950/50 border border-green-500/30 text-green-400 font-mono text-sm">
                        <span>CREDIT LINE SECURE</span>
                        <span>•</span>
                        <span>PROJECT: gen-lang-client-0303535965</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center border-b border-nexus-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-nexus-gray-100 flex items-center gap-3">
                        <DollarSign className="text-nexus-primary" />
                        Billing & Finance
                    </h2>
                    <p className="text-nexus-gray-400 mt-1">Organization: 2408915587</p>
                </div>
                <div className="text-right">
                     <span className="text-sm text-nexus-gray-500">Total Active Spend</span>
                     <div className="text-3xl font-mono text-white font-bold">$3,300.00</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {billingAccounts.map((account, idx) => (
                    <div 
                        key={idx} 
                        className={`border rounded-xl p-6 transition-all flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group ${
                            account.isOpen 
                            ? 'bg-nexus-surface/50 border-nexus-border hover:border-nexus-primary/30' 
                            : 'bg-slate-900/30 border-slate-800 opacity-70 grayscale-[0.5]'
                        }`}
                    >
                        <div className="absolute -right-10 -top-10 text-[100px] font-bold text-white/5 pointer-events-none select-none">
                            {account.isOpen ? 'GCP' : 'OFF'}
                        </div>

                        <div className="flex items-center gap-4 flex-1 z-10 w-full">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                account.isOpen ? 'bg-slate-800 text-nexus-secondary' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {account.isOpen ? <Server size={24} /> : <AlertOctagon size={24} />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-nexus-gray-100 text-lg flex items-center gap-2 truncate">
                                    {account.displayName}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-nexus-gray-400 mt-1">
                                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-gray-400 border border-slate-700 text-xs">
                                        ID: {account.id}
                                    </span>
                                    {account.isOpen && (
                                        <span className="flex items-center gap-1 text-nexus-accent text-xs">
                                            <Briefcase size={10} /> {account.linkedProject}
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-xs border ${
                                        account.isOpen
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {account.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {account.isOpen && (
                            <div className="flex-1 w-full md:w-auto z-10">
                                <div className="flex justify-between text-xs text-nexus-gray-400 mb-1">
                                    <span>Quota Usage</span>
                                    <span>{account.usage}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${account.usage > 80 ? 'bg-nexus-secondary' : 'bg-nexus-primary'}`} 
                                        style={{ width: `${account.usage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <div className="text-xl font-bold text-nexus-gray-100">${account.cost.toFixed(2)}</div>
                                <div className="text-xs text-nexus-gray-500 flex items-center gap-1 justify-end">
                                    <Calendar size={10} /> Next: {account.nextBilling}
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDownloadInvoice(account.id)}
                                className="p-2 hover:bg-slate-700 rounded-lg text-nexus-gray-400 hover:text-white transition-colors"
                                title="Download Latest Invoice"
                                disabled={!account.isOpen}
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                 <div className="bg-nexus-surface/30 border border-nexus-border rounded-xl p-6">
                    <h3 className="text-lg font-bold text-nexus-gray-100 mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-nexus-accent" /> Recent Transactions
                    </h3>
                    <div className="space-y-3">
                        {transactions.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${tx.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-200">{tx.description}</div>
                                        <div className="text-xs text-gray-500">{tx.date} • {tx.method}</div>
                                    </div>
                                </div>
                                <span className="font-mono text-sm font-bold text-white">${tx.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="bg-nexus-surface/30 border border-nexus-border rounded-xl p-6">
                    <h3 className="text-lg font-bold text-nexus-gray-100 mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-nexus-secondary" /> Payment Methods
                    </h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-1 rounded w-10 h-6 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-blue-800 italic">VISA</span>
                                </div>
                                <div>
                                    <div className="font-mono text-nexus-gray-300">•••• 8746</div>
                                    <span className="text-xs text-nexus-gray-500">Sulaiman Alshammari</span>
                                </div>
                            </div>
                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Primary</span>
                        </div>
                     </div>
                     <div className="mt-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                         <h4 className="text-sm font-bold text-blue-400 mb-1">Enterprise Budget Alert</h4>
                         <p className="text-xs text-blue-300/70">
                             Current spending is within 85% of the allocated budget. No overage charges predicted for this cycle.
                         </p>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Billing;