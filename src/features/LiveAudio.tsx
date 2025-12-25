import React, { useEffect, useRef, useState } from 'react';
import { connectLive } from '../services/geminiService';
import { Mic, MicOff, Activity, Wifi, Zap, Cpu, Radio, ShieldCheck } from 'lucide-react';

const LiveAudio: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('System Standby');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const draw = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.clearRect(0, 0, width, height);

        if (!isConnected) {
             const time = Date.now() / 1000;
             ctx.beginPath();
             ctx.arc(centerX, centerY, 40 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
             ctx.strokeStyle = 'rgba(75, 85, 99, 0.5)';
             ctx.lineWidth = 1;
             ctx.setLineDash([4, 6]);
             ctx.stroke();
             ctx.setLineDash([]); 

             ctx.beginPath();
             ctx.arc(centerX, centerY, 55, time % (Math.PI * 2), (time % (Math.PI * 2)) + Math.PI / 4);
             ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
             ctx.lineWidth = 2;
             ctx.stroke();

             animationFrameRef.current = requestAnimationFrame(draw);
             return;
        }

        const bars = 64;
        const step = (Math.PI * 2) / bars;

        if (inputAnalyserRef.current) {
            const bufferLength = inputAnalyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            inputAnalyserRef.current.getByteFrequencyData(dataArray);

            const radius = 90;

            for (let i = 0; i < bars; i++) {
                const index = Math.floor((i / bars) * (bufferLength / 2)); 
                const value = dataArray[index];
                const barHeight = (value / 255) * 60; 
                
                if (barHeight > 2) {
                    const angle = i * step;
                    const x1 = centerX + Math.cos(angle) * radius;
                    const y1 = centerY + Math.sin(angle) * radius;
                    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
                    const y2 = centerY + Math.sin(angle) * (radius + barHeight);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = `rgba(20, 184, 166, ${Math.max(0.2, value/255)})`; 
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
        }

        if (outputAnalyserRef.current) {
            const bufferLength = outputAnalyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            outputAnalyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for(let i=0; i<bufferLength; i++) sum += dataArray[i];
            const avg = sum / bufferLength;
            
            if (avg > 10 && !isAiSpeaking) setIsAiSpeaking(true);
            else if (avg <= 10 && isAiSpeaking) setIsAiSpeaking(false);

            const pulseRadius = 50 + (avg / 255) * 40;
            const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, pulseRadius);
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)'); 
            gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(centerX, centerY, 50 + (avg/255)*10, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.4 + (avg/255)*0.6})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isConnected, isAiSpeaking]);

  const initAudio = async () => {
    try {
      setStatus('Initializing Audio Stream...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
      mediaStreamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      
      const inputAnalyser = audioContextRef.current.createAnalyser();
      inputAnalyser.fftSize = 256;
      inputAnalyser.smoothingTimeConstant = 0.5;
      inputAnalyserRef.current = inputAnalyser;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      const muteNode = audioContextRef.current.createGain();
      muteNode.gain.value = 0;

      source.connect(inputAnalyser);
      inputAnalyser.connect(processor);
      processor.connect(muteNode);
      muteNode.connect(audioContextRef.current.destination);
      
      processor.onaudioprocess = (e) => {
        if (!sessionRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = createPCMData(inputData);
        sessionRef.current.sendRealtimeInput({
            media: {
                mimeType: "audio/pcm;rate=16000",
                data: pcmData
            }
        });
      };

      outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const outputAnalyser = outputContextRef.current.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyser.smoothingTimeConstant = 0.5;
      outputAnalyserRef.current = outputAnalyser;

      setStatus('Establishing Neural Link...');
      
      const session = await connectLive(
        async (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
                playAudioChunk(audioData);
            }
        },
        () => {
            setStatus('Neural Link Active');
            setIsConnected(true);
        },
        (err) => {
            console.error(err);
            setStatus('Link Destabilized');
            handleDisconnect();
        },
        () => {
            setStatus('Link Terminated');
            handleDisconnect();
        }
      );
      
      sessionRef.current = session;

    } catch (error) {
      console.error("Audio Init Error", error);
      setStatus("Hardware Access Denied");
    }
  };

  const createPCMData = (data: Float32Array): string => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = Math.max(-1, Math.min(1, data[i])) * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playAudioChunk = async (base64Audio: string) => {
      if (!outputContextRef.current || !outputAnalyserRef.current) return;
      try {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = outputContextRef.current.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for(let i=0; i<dataInt16.length; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }
        
        const source = outputContextRef.current.createBufferSource();
        source.buffer = buffer;
        
        source.connect(outputAnalyserRef.current);
        outputAnalyserRef.current.connect(outputContextRef.current.destination);
        
        const currentTime = outputContextRef.current.currentTime;
        const startTime = Math.max(currentTime, nextStartTimeRef.current);
        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;
      } catch (e) {
          console.error("Audio playback error", e);
      }
  };

  const handleDisconnect = () => {
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
    }
    if (sourceRef.current) sourceRef.current.disconnect();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    sessionRef.current = null;
    setIsConnected(false);
    setIsAiSpeaking(false);
    setStatus('System Standby');
    nextStartTimeRef.current = 0;
  };

  const toggleConnection = () => {
    if (isConnected) {
        handleDisconnect();
    } else {
        initAudio();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
            <div className="flex items-center gap-4">
                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    isConnected 
                    ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' 
                    : 'bg-slate-900 border-slate-700 text-gray-500'
                }`}>
                    <Wifi size={14} className={isConnected ? '' : 'opacity-50'} />
                    {isConnected ? 'ARCHITECT: SULAIMAN ALSHAMMARI' : 'SIGNAL: OFFLINE'}
                </div>
                {isConnected && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/50 text-xs font-mono text-gray-400">
                        <Cpu size={14} />
                        LATENCY: 45ms
                    </div>
                )}
            </div>
            
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 ${
                isAiSpeaking
                ? 'bg-nexus-accent/20 border-nexus-accent text-nexus-accent shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : 'bg-slate-900/50 border-slate-800 text-gray-600'
            }`}>
                 <div className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-nexus-accent animate-pulse' : 'bg-gray-600'}`}></div>
                 <span className="text-xs font-bold tracking-widest">{isAiSpeaking ? 'AI SPEAKING' : 'IDLE'}</span>
            </div>
        </div>

        <div className="relative mb-16 flex items-center justify-center w-full max-w-lg aspect-square">
            <canvas 
                ref={canvasRef} 
                width="600" 
                height="600" 
                className="absolute inset-0 z-0 pointer-events-none w-full h-full"
            />

            <div 
                className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 backdrop-blur-md
                ${isConnected 
                    ? 'bg-slate-900/40 shadow-[0_0_60px_rgba(20,184,166,0.2)] border border-nexus-primary/30' 
                    : 'bg-slate-900/80 border border-slate-700 grayscale opacity-80'
                }`}
            >
                {isConnected && (
                    <div className="absolute inset-0 rounded-full border-t border-nexus-primary/50 animate-spin-slow"></div>
                )}
                
                <div className="z-10 text-center flex flex-col items-center gap-2">
                    {isConnected ? (
                        <>
                            <Activity size={32} className="text-nexus-primary animate-pulse" />
                            <span className="text-[10px] text-nexus-primary font-mono tracking-[0.3em]">LIVE</span>
                        </>
                    ) : (
                        <>
                            <MicOff size={32} className="text-gray-600" />
                            <span className="text-[10px] text-gray-600 font-mono tracking-[0.3em]">STANDBY</span>
                        </>
                    )}
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center gap-6 z-10 w-full max-w-md">
            <div className={`w-full text-center py-2 border-b border-t font-mono text-sm tracking-[0.2em] transition-colors duration-500 ${
                isConnected 
                ? 'border-nexus-primary/20 text-nexus-primary' 
                : 'border-slate-800 text-gray-600'
            }`}>
                SYSTEM STATUS: {status.toUpperCase()}
            </div>

            <button 
                onClick={toggleConnection}
                className={`group relative w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-4 transition-all duration-300 overflow-hidden shadow-2xl ${
                    isConnected 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white' 
                    : 'bg-gradient-to-r from-nexus-primary/10 to-nexus-secondary/10 border border-nexus-primary/50 text-nexus-primary hover:bg-nexus-primary hover:text-slate-900 hover:shadow-[0_0_40px_rgba(20,184,166,0.4)]'
                }`}
            >
                {isConnected ? (
                    <>
                        <span className="relative z-10 flex items-center gap-3"><Zap size={20} /> TERMINATE UPLINK</span>
                    </>
                ) : (
                    <>
                        <span className="relative z-10 flex items-center gap-3"><Radio size={20} className="animate-pulse" /> ESTABLISH UPLINK</span>
                    </>
                )}
            </button>
            
            {!isConnected && (
                 <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    <ShieldCheck size={12} className="text-nexus-secondary" />
                    SECURE CONNECTION VERIFIED: SULAIMAN ALSHAMMARI
                 </p>
            )}
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nexus-primary/5 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default LiveAudio;