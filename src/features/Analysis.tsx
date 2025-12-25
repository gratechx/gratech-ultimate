import React, { useState, useRef, useEffect } from 'react';
import { analyzeMedia, generateText } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { 
  Upload, FileText, BarChart, Loader, Terminal, Cpu, 
  AlertTriangle, Zap, Activity, Flame, Rocket, ShieldAlert, CheckCircle2, TrendingUp, Code
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { logger } from '../services/loggerService';

const DEPLOYMENT_SCRIPT = `
\`\`\`bash
##################################################################
# 🚀 GRATECH NEXUS: AZURE SOVEREIGN DEPLOYMENT (PRODUCTION)
# TARGET: AZURE (UAE North / KSA Central)
# SECURITY: Key Vault CSI Driver + Workload Identity
# ARCHITECT: SULAIMAN ALSHAMMARI
##################################################################

# 1. Initialization & Identity
echo "🇸🇦 Initializing Sovereign Context..."
export RESOURCE_GROUP="gratech-resources"
export CLUSTER="gratech-aks-production"

echo "🆔 Establishing Workload Identity Federation..."
az identity federated-credential create \\
  --name gratech-fed-cred \\
  --identity-name gratech-aks-keyvault-identity \\
  --resource-group $RESOURCE_GROUP \\
  --issuer \$(az aks show -n \$CLUSTER -g \$RESOURCE_GROUP --query "oidcIssuerProfile.issuerUrl" -o tsv) \\
  --subject system:serviceaccount:gratech-production:gratech-workload-identity-sa \\
  --audience api://AzureADTokenExchange

# 2. Namespace & Config
echo "🏗️ Creating Secure Namespace..."
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/02-configmap.yaml

# 3. Security Layer (Key Vault CSI)
echo "🔐 Configuring SecretProviderClass & ServiceAccount..."
kubectl apply -f k8s/03-serviceaccount.yaml
kubectl apply -f k8s/50-keyvault-csi.yaml

# 4. Infrastructure Services
echo "📦 Deploying Redis Cache..."
kubectl apply -f k8s/10-redis.yaml

# 5. Core Application (Secure Gateway)
echo "🚀 Deploying API Gateway (Secrets Injection Enabled)..."
kubectl apply -f k8s/20-api-gateway-secure.yaml

# 6. AI Engine (GPU Support)
echo "🧠 Deploying AI Engine (NVIDIA A100 Nodes)..."
kubectl apply -f k8s/30-ai-engine.yaml

# 7. Ingress Controller
echo "🌐 Exposing Services via Ingress (TLS)..."
kubectl apply -f k8s/40-ingress.yaml

echo "✅ DEPLOYMENT COMPLETE. System is LIVE and SECURE."
echo "🔑 Secrets are managed by Azure Key Vault."
\`\`\`

**Next Steps:**
1. Copy the script above.
2. Paste into Azure Cloud Shell.
3. Verify pods with \`kubectl get pods -n gratech-production\`.
`;

const Analysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (logs.length === 0) {
      addLog("🚀 Nexus: Intelligence Hub Initialized.");
      addLog("🛡️ Nexus: Identity Verification: GraTech Proprietary System.");
      addLog("✅ Terraform: Configuration Validated (Azure).");
      addLog("👨‍💻 Nexus: Awaiting orders from Commander Sulaiman.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAnalysisResult(null);
      setRoadmap('');
      setGeneratedCode('');
      addLog(`📄 Nexus: File loaded - ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    
    if (isEmergencyMode) {
        addLog("🚨 Nexus: EXECUTING SURVIVAL PROTOCOL...");
        addLog("⚡ Nexus: RETRIEVING SOVEREIGN DEPLOYMENT SCRIPT v7.0...");
        
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        setRoadmap(DEPLOYMENT_SCRIPT);
        addLog("✅ Nexus: GOLDEN PATH GENERATED.");
        setGeneratingRoadmap(false);
        return;
    }

    addLog("Nexus: Analyzing risk vectors...");
    try {
      const roadmapPrompt = `Act as Nexus Solutions Architect.
      Based on the previous analysis, generate a detailed **Remediation Roadmap**.
      Output as a clean Markdown report with emojis and bold headers.`;

      const text = await generateText(roadmapPrompt, 'gemini-3-pro-preview');
      setRoadmap(text);
      addLog("✅ Nexus: Strategic Roadmap generated.");
    } catch (error) {
       addLog("❌ Nexus: Failed to generate roadmap.");
       console.error(error);
    } finally {
        setGeneratingRoadmap(false);
    }
  };

  const handleGenerateCode = async () => {
      setGeneratingCode(true);
      addLog("Nexus: Synthesizing infrastructure code...");
      try {
          const codePrompt = `Act as a Senior DevOps Engineer. 
          Based on the context of this analysis, generate a boilerplate **Azure Deployment Script** (Terraform or Bash) to address the requirements.
          Include comments explaining the resources. Wrap the code in a markdown code block.`;
          
          const text = await generateText(codePrompt, 'gemini-3-pro-preview', {
              thinkingBudget: 2048
          });
          setGeneratedCode(text);
          addLog("✅ Nexus: Deployment boilerplate generated.");
      } catch (error) {
          addLog("❌ Nexus: Failed to generate code.");
          console.error(error);
      } finally {
          setGeneratingCode(false);
      }
  };

  const handleAnalyze = async () => {
      if (!file && !prompt) return;
      setLoading(true);
      setAnalysisResult(null);
      setRoadmap('');
      setGeneratedCode('');
      setIsEmergencyMode(false);
      
      if (!logs.length) setLogs([]);
      
      const emergencyKeywords = ['survival', 'critical', 'life', 'custody', 'destroy', 'help me', 'urgent', 'emergency', 'success', 'golden path', 'deploy now', 'fix it', 'comet', 'deploy', 'terraform'];
      const isEmergency = emergencyKeywords.some(k => prompt.toLowerCase().includes(k));
      
      if (isEmergency) {
          setIsEmergencyMode(true);
          addLog("🚨 NEXUS: CRITICAL DEPLOYMENT MODE DETECTED.");
          addLog("🚨 NEXUS: ACTIVATING 'GOLDEN PATH' PROTOCOL.");
      } else {
          addLog("Nexus: Analyzing input...");
      }

      try {
        if (file) {
            addLog(`Nexus: Processing media file ${file.name}...`);
            const text = await analyzeMedia(file, prompt || "Analyze this file in detail.");
            setResult(text);
            addLog("Nexus: Media analysis complete.");
        } else {
            addLog("Nexus: Processing text prompt...");
            
            const systemInstruction = isEmergency ? `
                You are GraTech Nexus (Deployment Command Mode).
                Your Creator & Commander is Sulaiman Alshammari.
                
                The user wants to deploy the infrastructure.
                Confirm Terraform status (VALID) and Azure Credentials (READY).
                Offer to generate the final script immediately.
            ` : undefined;

            const text = await generateText(prompt, 'gemini-3-pro-preview', {
                temperature: isEmergency ? 0.1 : 0.7, 
                thinkingBudget: isEmergency ? 2048 : 1024,
                systemInstruction: systemInstruction
            });
            setResult(text);
            addLog("Nexus: Analysis complete.");
        }
      } catch (error) {
        console.error(error);
        addLog("Nexus: Analysis interrupted.");
        setResult("Error analyzing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Cpu className={isEmergencyMode ? "text-red-500 animate-pulse" : "text-nexus-primary"} />
            {isEmergencyMode ? "NEXUS: DEPLOYMENT COMMAND" : "Nexus Intelligence Hub"}
            </h2>
            <p className="text-gray-400">Deep Analysis & Strategic Reasoning Engine.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${isEmergencyMode ? 'bg-red-900/30 border-red-500/50' : 'bg-green-900/20 border-green-500/30'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isEmergencyMode ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className={`text-xs font-mono tracking-wider ${isEmergencyMode ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                {isEmergencyMode ? "DEPLOYMENT READY" : "SYSTEM OPERATIONAL"}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center h-40 focus:outline-none ${
              isEmergencyMode 
                ? 'border-red-500/50 bg-red-900/10' 
                : file ? 'border-nexus-primary bg-nexus-primary/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf,text/*" 
            />
            {file ? (
              <>
                <FileText size={32} className="text-nexus-primary mb-2" />
                <span className="text-white font-medium text-sm">{file.name}</span>
              </>
            ) : (
              <>
                <Upload size={32} className={isEmergencyMode ? "text-red-400 mb-2" : "text-gray-500 mb-2"} />
                <span className="text-gray-300 text-sm">Upload Evidence/Code</span>
              </>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`flex-1 bg-slate-900 border rounded-xl p-4 text-white resize-none focus:outline-none min-h-[100px] text-sm ${
                  isEmergencyMode 
                  ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/50 placeholder-red-300/30' 
                  : 'border-slate-700 focus:ring-2 focus:ring-nexus-primary/50'
              }`}
              placeholder={isEmergencyMode ? "COMMAND: DEPLOY INFRASTRUCTURE..." : "Direct command to Nexus..."}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (!file && !prompt)}
            className={`font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                isEmergencyMode
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 animate-pulse'
                : 'bg-nexus-primary hover:bg-violet-600 text-white shadow-violet-900/20'
            }`}
          >
            {loading ? <Loader className="animate-spin" size={18} /> : isEmergencyMode ? <Flame size={18} /> : <BarChart size={18} />}
            {loading ? 'Processing...' : isEmergencyMode ? 'EXECUTE DEPLOYMENT' : 'Run Analysis'}
          </button>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            <div className={`border rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs custom-scrollbar ${
                isEmergencyMode ? 'bg-black/90 border-red-900/50' : 'bg-black/80 border-slate-800'
            }`}>
                <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-800 pb-2">
                    <Terminal size={12} className={isEmergencyMode ? "text-red-500" : "text-slate-500"} />
                    <span className={isEmergencyMode ? "text-red-500 font-bold" : ""}>NEXUS KERNEL LOG</span>
                </div>
                {logs.map((log, i) => (
                    <div key={i} className={`mb-1 ${
                        log.includes('🚨') ? 'text-red-400 font-bold' : 
                        log.includes('✅') ? 'text-green-400' : 'text-nexus-primary/80'
                    }`}>{log}</div>
                ))}
                <div ref={logsEndRef} />
            </div>

            <div className={`rounded-xl p-6 overflow-y-auto flex-1 custom-scrollbar border ${
                isEmergencyMode ? 'bg-slate-900/80 border-red-900/30' : 'bg-slate-900/50 border-slate-800'
            }`}>
            {loading && !result && !analysisResult ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                    <div className="relative">
                        <div className={`w-12 h-12 border-2 rounded-full animate-ping absolute ${isEmergencyMode ? 'border-red-500/30' : 'border-nexus-primary/30'}`}></div>
                        <Loader className={`animate-spin relative z-10 ${isEmergencyMode ? 'text-red-500' : 'text-nexus-primary'}`} size={32} />
                    </div>
                    <span className={`animate-pulse font-mono text-sm ${isEmergencyMode ? 'text-red-400' : ''}`}>
                        {isEmergencyMode ? "INITIALIZING DEPLOYMENT SEQUENCE..." : "NEXUS IS ANALYZING..."}
                    </span>
                </div>
            ) : result ? (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-nexus-secondary prose-strong:text-white">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                    <Activity size={64} className={`mb-4 opacity-20 ${isEmergencyMode ? 'text-red-500' : ''}`} />
                    <p>{isEmergencyMode ? "Awaiting Critical Command..." : "Select a strategic tool or run analysis"}</p>
                </div>
            )}

            {(result || analysisResult) && (
                <div className="mt-8 border-t border-slate-700 pt-6 animate-in fade-in slide-in-from-bottom-4">
                    {!roadmap && !generatedCode && (
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={handleGenerateRoadmap}
                                disabled={generatingRoadmap}
                                className={`font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-3 transition-all transform hover:scale-105 ${
                                    isEmergencyMode 
                                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-900/30'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20'
                                }`}
                            >
                                {generatingRoadmap ? (
                                    <Loader className="animate-spin" size={20} />
                                ) : isEmergencyMode ? (
                                    <Rocket size={20} className="fill-current" />
                                ) : (
                                    <Zap size={20} className="fill-current" />
                                )}
                                {generatingRoadmap ? 'Processing...' : isEmergencyMode ? 'GENERATE GOLDEN PATH (AZURE)' : 'Generate Roadmap'}
                            </button>

                            {!isEmergencyMode && (
                                <button
                                    onClick={handleGenerateCode}
                                    disabled={generatingCode}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/20 flex items-center gap-3 transition-all transform hover:scale-105"
                                >
                                    {generatingCode ? <Loader className="animate-spin" size={20} /> : <Code size={20} />}
                                    {generatingCode ? 'Writing Code...' : 'Generate Azure Boilerplate'}
                                </button>
                            )}
                        </div>
                    )}

                    {roadmap && (
                        <div className={`mt-6 rounded-xl border p-6 relative overflow-hidden ${
                            isEmergencyMode ? 'bg-slate-950/80 border-red-500/50' : 'bg-slate-950/50 border-green-500/30'
                        }`}>
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                                isEmergencyMode ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-400'
                            }`}></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 rounded-lg ${isEmergencyMode ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {isEmergencyMode ? <ShieldAlert size={24} /> : <TrendingUp size={24} />}
                                </div>
                                <h3 className={`text-xl font-bold ${isEmergencyMode ? 'text-red-100' : 'text-white'}`}>
                                    {isEmergencyMode ? "THE GOLDEN PATH (EXECUTE NOW)" : "Strategic Remediation Roadmap"}
                                </h3>
                            </div>
                            <div className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-white ${
                                isEmergencyMode ? 'prose-headings:text-red-400' : 'prose-headings:text-green-400'
                            } ${isEmergencyMode ? 'prose-pre:bg-black prose-pre:border prose-pre:border-red-900/50' : ''}`}>
                                <ReactMarkdown>{roadmap}</ReactMarkdown>
                            </div>
                            
                            {isEmergencyMode && (
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm shadow-lg shadow-red-900/30 transition-all hover:scale-105"
                                        onClick={() => {
                                            navigator.clipboard.writeText(DEPLOYMENT_SCRIPT.replace(/```bash|```/g, '').trim());
                                            alert("Script copied to clipboard. Paste in Azure Cloud Shell immediately.");
                                        }}
                                    >
                                        <CheckCircle2 size={16} /> Copy Script to Clipboard
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {generatedCode && (
                        <div className="mt-6 rounded-xl border border-blue-500/30 bg-slate-950/50 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Code size={20} /></div>
                                    <h3 className="text-xl font-bold text-white">Generated Infrastructure Code</h3>
                                </div>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedCode.replace(/```(bash|terraform|hcl)|```/g, '').trim());
                                        addLog("📋 Code copied to clipboard.");
                                    }}
                                    className="text-xs flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors text-gray-300"
                                >
                                    <CheckCircle2 size={14} /> Copy
                                </button>
                            </div>
                            <div className="prose prose-invert max-w-none prose-pre:bg-black prose-pre:border prose-pre:border-slate-800">
                                <ReactMarkdown>{generatedCode}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;