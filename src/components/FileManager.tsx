import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FileText, HardDrive, Search, ChevronRight, 
  ChevronDown, Shield, FileCode, FileJson, Lock, 
  Cpu, Download, Trash2, AlertTriangle,
  Server, AlertOctagon, Terminal
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  date: string;
  kind?: string;
  locked?: boolean;
  content?: string;
  children?: FileItem[];
  isBin?: boolean;
}

const INITIAL_FILE_SYSTEM: FileItem[] = [
  {
    name: 'C: Local Disk',
    type: 'folder',
    date: '—',
    children: [
      { name: 'ai_studio_code.ts', type: 'file', size: '38B', date: '2025-12-06', kind: 'ts' },
      { name: 'response_2912.json', type: 'file', size: '1KB', date: '2025-12-06', kind: 'json' },
      {
        name: 'GraTech',
        type: 'folder',
        date: '2025-12-06',
        children: [
            { name: 'paste.txt', type: 'file', size: '1KB', date: '2025-12-20', kind: 'txt' },
            { 
              name: '00_Documentation', 
              type: 'folder', 
              date: '2025-12-06', 
              children: [
                { name: 'GraTech_Architecture_v3.md', type: 'file', size: '18KB', date: '2025-12-07', kind: 'md' }
              ] 
            }, 
            { name: '01_Source', type: 'folder', date: '2025-12-06', children: [
                { name: 'main.py', type: 'file', size: '15KB', date: '2025-12-06', kind: 'py' },
                { name: 'main_v2.py', type: 'file', size: '16KB', date: '2025-12-06', kind: 'py' },
            ]},
            { name: 'Vault', type: 'folder', date: '2025-12-06', locked: true, children: [
                { name: 'Server-Keys', type: 'folder', date: '2025-12-06', children: [
                    { name: 'azur1.pem', type: 'file', size: '2.44KB', date: '2025-12-06', kind: 'pem', locked: true },
                ]}
            ]},
            { name: 'Chrome-Extensions', type: 'folder', date: '2025-12-06', children: [
                { name: 'GraTech-AI-Ultimate.pem', type: 'file', size: '2KB', date: '2025-12-06', kind: 'pem' }
            ]}
        ]
      },
      {
        name: 'Users',
        type: 'folder',
        date: '2023-09-12',
        children: [
            { name: 'Sulaiman', type: 'folder', date: '2023-09-12', children: [
                { name: 'Desktop', type: 'folder', date: '2025-12-06', children: [
                    { name: 'Sulaiman_Resume_Honest.pdf', type: 'file', size: '2.4MB', date: '2025-12-06', kind: 'pdf' },
                    { name: 'copilot-commit عمليات.txt', type: 'file', size: '2.20MB', date: '2025-12-06', kind: 'txt' },
                    { name: 'GraTech System.lnk', type: 'file', size: '1KB', date: '2025-12-06', kind: 'lnk' }
                ]},
                { name: 'Downloads', type: 'folder', date: '2025-12-06', children: [] }
            ]}
        ]
      }
    ]
  },
  {
    name: 'Recycle Bin',
    type: 'folder',
    date: '—',
    isBin: true,
    children: [
        { name: 'azur1.pem', type: 'file', size: '2KB', date: '2024-12-01', kind: 'pem', locked: true },
        { name: 'GraTech-Ultimate', type: 'folder', date: '2025-12-01', children: [] },
    ]
  },
  {
    name: 'Z: Azure Mount',
    type: 'folder',
    date: '—',
    children: [
        { name: 'Backup_2025_Final.zip', type: 'file', size: '45GB', date: '2025-12-06', kind: 'zip' }
    ]
  }
];

const FileManager: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileItem[]>(INITIAL_FILE_SYSTEM);
  const [currentPath, setCurrentPath] = useState<string[]>(['C: Local Disk', 'GraTech']);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [outputLog, setOutputLog] = useState<string[]>(['GraTech File System [Version 3.0.1]', '(c) 2025 GraTech Corp. All rights reserved.', ' ']);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLog]);
  
  const getCurrentFolderContent = () => {
    let current = fileSystem;
    const rootName = currentPath[0];
    let root = current.find(i => i.name === rootName);
    
    if (!root || !root.children) return [];
    
    let currentChildren = root.children;
    
    for (let i = 1; i < currentPath.length; i++) {
        const folderName = currentPath[i];
        const found = currentChildren.find(c => c.name === folderName);
        if (found && found.children) {
            currentChildren = found.children;
        } else {
            return [];
        }
    }
    return currentChildren;
  };

  const getIcon = (item: FileItem) => {
    if (!item) return <FileText className="text-zinc-400" size={18} />;
    if (item.name === 'Recycle Bin') return <Trash2 className="text-red-500 fill-red-500/10" size={20} />;
    if (item.type === 'folder') return <Folder className="text-yellow-500 fill-yellow-500/20" size={20} />;
    if (item.kind === 'pem' || item.locked) return <Lock className="text-red-400" size={18} />;
    if (item.kind === 'sys' || item.kind === 'exe') return <Cpu className="text-blue-400" size={18} />;
    if (item.kind === 'json') return <FileJson className="text-green-400" size={18} />;
    if (item.kind === 'yaml' || item.kind === 'py' || item.kind === 'ts') return <FileCode className="text-purple-400" size={18} />;
    if (item.kind === 'md' || item.kind === 'txt') return <FileText className="text-zinc-400" size={18} />;
    if (item.kind === 'pdf') return <FileText className="text-red-400" size={18} />;
    return <FileText className="text-zinc-400" size={18} />;
  };

  const handleNavigate = (pathIndex: number) => {
      setCurrentPath(prev => prev.slice(0, pathIndex + 1));
      setSelectedFile(null);
  };

  const handleItemClick = (item: FileItem) => {
      if (!item) return;
      if (item.type === 'folder') {
          setCurrentPath(prev => [...prev, item.name]);
          setSelectedFile(null);
      } else {
          setSelectedFile(item);
      }
  };

  const logToTerminal = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
      setOutputLog(prev => [...prev.slice(-8), text]);
  };

  const handleExecuteCommand = () => {
    if (!commandInput.trim()) return;
    const rawCmd = commandInput.trim();
    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').replace(/"/g, '');

    setCommandInput('');
    logToTerminal(`> ${rawCmd}`);

    const currentContent = getCurrentFolderContent();

    try {
        switch (cmd) {
            case 'help':
                logToTerminal('Available commands: cd, ls, open, delete, cls');
                break;
            case 'cls':
            case 'clear':
                setOutputLog([]);
                break;
            case 'ls':
            case 'dir':
                const files = currentContent.map(f => f.type === 'folder' ? `[${f.name}]` : f.name).join('  ');
                logToTerminal(files || '(empty directory)');
                break;
            case 'cd':
                if (!arg) {
                    logToTerminal('Usage: cd <directory>');
                    return;
                }
                if (arg === '..') {
                    if (currentPath.length > 1) {
                        setCurrentPath(prev => prev.slice(0, -1));
                        setSelectedFile(null);
                        logToTerminal(`Changed directory to ${currentPath[currentPath.length - 2] || 'Root'}`);
                    } else {
                        logToTerminal('Already at root.', 'error');
                    }
                } else {
                    const target = currentContent.find(i => i.name.toLowerCase() === arg.toLowerCase() && i.type === 'folder');
                    if (target) {
                        setCurrentPath(prev => [...prev, target.name]);
                        setSelectedFile(null);
                    } else {
                        logToTerminal(`System cannot find path specified: ${arg}`, 'error');
                    }
                }
                break;
            case 'open':
                if (!arg) {
                    logToTerminal('Usage: open <filename>');
                    return;
                }
                const fileToOpen = currentContent.find(i => i.name.toLowerCase() === arg.toLowerCase() && i.type === 'file');
                if (fileToOpen) {
                    setSelectedFile(fileToOpen);
                    logToTerminal(`Opened ${fileToOpen.name}`);
                } else {
                    logToTerminal(`File not found: ${arg}`, 'error');
                }
                break;
            case 'delete':
            case 'del':
            case 'rm':
                if (!arg) {
                    logToTerminal('Usage: delete <filename>');
                    return;
                }
                const newFS = JSON.parse(JSON.stringify(fileSystem));
                let ptr: FileItem | undefined = newFS.find((i: FileItem) => i.name === currentPath[0]);
                for (let i = 1; i < currentPath.length; i++) {
                    ptr = ptr?.children?.find((c: FileItem) => c.name === currentPath[i]);
                }
                if (ptr && ptr.children) {
                    const idx = ptr.children.findIndex((c: FileItem) => c.name.toLowerCase() === arg.toLowerCase());
                    if (idx !== -1) {
                        const [removed] = ptr.children.splice(idx, 1);
                        const bin = newFS.find((i: FileItem) => i.name === 'Recycle Bin');
                        if (bin && bin.children) {
                            bin.children.push(removed);
                        }
                        setFileSystem(newFS);
                        setSelectedFile(null);
                        logToTerminal(`Deleted ${arg}. Moved to Recycle Bin.`, 'success');
                    } else {
                        logToTerminal(`File not found: ${arg}`, 'error');
                    }
                }
                break;
            default:
                logToTerminal(`'${cmd}' is not recognized as an internal or external command.`, 'error');
        }
    } catch (e) {
        logToTerminal('Error executing command.', 'error');
        console.error(e);
    }
  };

  const isBin = currentPath[0] === 'Recycle Bin';

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className={`bg-[#18181b] border-b border-white/5 p-3 flex items-center justify-between ${isBin ? 'border-b-red-900/50 bg-red-950/10' : ''}`}>
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <button onClick={() => currentPath.length > 1 && handleNavigate(currentPath.length - 2)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400"><ChevronDown className="rotate-90" size={18} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 opacity-50"><ChevronRight size={18} /></button>
                </div>
                <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-sm text-zinc-300">
                   {isBin ? <Trash2 size={14} className="text-red-500 mr-2" /> : <HardDrive size={14} className="text-zinc-500 mr-2" />}
                   {currentPath.map((segment, idx) => (
                       <React.Fragment key={idx}>
                           {idx > 0 && <span className="text-zinc-600">/</span>}
                           <button onClick={() => handleNavigate(idx)} className="hover:text-white hover:bg-white/5 px-1 rounded transition-colors whitespace-nowrap max-w-[150px] truncate">
                               {segment}
                           </button>
                       </React.Fragment>
                   ))}
                </div>
            </div>
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input 
                    type="text" 
                    placeholder={isBin ? "Search Trash" : "Search C:/"}
                    className="bg-black/40 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-gratech-primary/30 w-64"
                />
            </div>
        </div>

        {isBin && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center gap-2 text-xs text-red-400 font-bold">
                <AlertOctagon size={14} />
                CRITICAL WARNING: SENSITIVE KEYS DETECTED IN TRASH. EMPTY IMMEDIATELY.
            </div>
        )}

        <div className="flex flex-1 overflow-hidden">
            <div className="w-64 bg-[#111113] border-r border-white/5 p-4 hidden md:block flex-shrink-0">
                <div className="space-y-4">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Drives</div>
                    <div className="space-y-1">
                        <div className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded cursor-pointer ${currentPath[0] === 'C: Local Disk' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`} onClick={() => setCurrentPath(['C: Local Disk'])}>
                            <HardDrive size={16} className="text-blue-400" />
                            <span>Local Disk (C:)</span>
                            <div className="ml-auto w-2 h-2 rounded-full bg-yellow-500" title="Warning: Exposed Keys"></div>
                        </div>
                        <div className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded cursor-pointer ${currentPath[0] === 'Z: Azure Mount' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`} onClick={() => setCurrentPath(['Z: Azure Mount'])}>
                            <Server size={16} className="text-purple-400" />
                            <span>Azure Storage (Z:)</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded cursor-pointer mt-4 ${currentPath[0] === 'Recycle Bin' ? 'bg-red-500/10 text-red-300' : 'text-red-400/70 hover:bg-red-500/10'}`} onClick={() => setCurrentPath(['Recycle Bin'])}>
                            <Trash2 size={16} />
                            <span>Recycle Bin</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getCurrentFolderContent().length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center h-40 text-zinc-600">
                                <Folder size={32} className="mb-2 opacity-50" />
                                <span className="text-sm">Empty Directory</span>
                            </div>
                        )}
                        {getCurrentFolderContent().map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => handleItemClick(item)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer group select-none ${
                                    selectedFile?.name === item.name 
                                    ? 'bg-gratech-primary/10 border-gratech-primary/40 shadow-[0_0_15px_rgba(50,184,198,0.1)]' 
                                    : 'bg-zinc-900/30 border-white/5 hover:bg-zinc-800 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 group-hover:scale-110 transition-transform relative">
                                        {getIcon(item)}
                                        {item.kind === 'pem' && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></div>}
                                    </div>
                                    {item.locked && <Shield size={14} className="text-red-500" />}
                                </div>
                                <div className="text-sm font-medium text-zinc-200 truncate">{item.name}</div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-zinc-500">{item.type === 'folder' ? 'Folder' : item.size}</div>
                                    <div className="text-[10px] text-zinc-600 font-mono">{item.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedFile && (
                    <div className="h-48 bg-[#0a0a0a] border-t border-white/10 p-4 flex gap-6 animate-slide-up shrink-0">
                        <div className="w-48 shrink-0 flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl border border-white/5 relative overflow-hidden">
                            {selectedFile.kind === 'pem' && <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>}
                            {getIcon(selectedFile)}
                            <div className="mt-2 text-sm font-bold text-white text-center px-2 truncate w-full">{selectedFile.name}</div>
                            <div className="text-xs text-zinc-500 uppercase">{selectedFile.kind || 'File'}</div>
                        </div>
                        
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-zinc-300">File Preview</h3>
                                {selectedFile.locked && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">ENCRYPTED / SENSITIVE</span>}
                            </div>
                            
                            <div className="font-mono text-xs text-zinc-500 bg-black border border-white/5 p-3 rounded-lg h-28 overflow-hidden select-text leading-relaxed">
                                {selectedFile.kind === 'pem' ? (
                                    <div className="text-red-400">
                                        -----BEGIN RSA PRIVATE KEY-----<br/>
                                        MIIEowIBAAKCAQEAw...<br/>
                                        <span className="bg-red-500/20 px-1">⚠️ CRITICAL: EXPOSED KEY</span><br/>
                                        <span className="text-zinc-700">*** REDACTED FOR SECURITY ***</span><br/>
                                        -----END RSA PRIVATE KEY-----
                                    </div>
                                ) : (
                                    <span className="italic opacity-50">Binary content not previewable in text mode.</span>
                                )}
                            </div>
                        </div>

                        <div className="w-48 flex flex-col gap-2 shrink-0">
                             {isBin ? (
                                 <button className="flex-1 bg-red-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20">
                                     <AlertTriangle size={14} /> PERMANENTLY DELETE
                                 </button>
                             ) : (
                                 <button className="flex-1 bg-white text-black rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-gratech-primary hover:text-white transition-colors">
                                     <Download size={14} /> Download
                                 </button>
                             )}
                             <button 
                                 onClick={() => {
                                     setCommandInput(`delete "${selectedFile.name}"`);
                                 }}
                                 className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                             >
                                 <Trash2 size={14} /> Delete
                             </button>
                        </div>
                    </div>
                )}
                
                <div className="bg-[#18181b] border-t border-white/5 flex flex-col">
                    <div ref={terminalRef} className="h-24 overflow-y-auto p-2 font-mono text-[10px] text-zinc-400 bg-black/20 custom-scrollbar border-b border-white/5">
                        {outputLog.map((line, i) => (
                            <div key={i} className={`whitespace-pre-wrap ${line.includes('Error') ? 'text-red-400' : line.startsWith('>') ? 'text-zinc-500' : 'text-zinc-300'}`}>
                                {line}
                            </div>
                        ))}
                    </div>

                    <div className="h-12 flex items-center px-4 gap-3">
                        <span className="text-zinc-500 font-mono text-xs select-none flex-shrink-0">
                            {currentPath[0] === 'Recycle Bin' ? 'Trash' : currentPath[currentPath.length - 1]}&gt;
                        </span>
                        <input 
                            type="text" 
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-green-400 font-mono placeholder-zinc-700 h-full"
                            placeholder="Type 'help', 'cd ..', 'ls', 'delete <file>'..."
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <button 
                            onClick={handleExecuteCommand}
                            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                            <Terminal size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FileManager;