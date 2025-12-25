import React, { useState, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Volume2, Play, Loader, Mic, Download, FileAudio, Loader2 } from 'lucide-react';

const TTS: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [voice, setVoice] = useState('Kore');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    
    const voices = [
        { name: 'Kore', label: 'Kore (Calm & Balanced)' },
        { name: 'Puck', label: 'Puck (Neutral)' },
        { name: 'Charon', label: 'Charon (Deep)' },
        { name: 'Fenrir', label: 'Fenrir (Intense)' },
        { name: 'Zephyr', label: 'Zephyr (Light)' }
    ];

    const encodeWAV = (samples: Int16Array, sampleRate: number) => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);
        const writeString = (view: DataView, offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        const offset = 44;
        for (let i = 0; i < samples.length; i++) {
            view.setInt16(offset + i * 2, samples[i], true);
        }

        return new Blob([view], { type: 'audio/wav' });
    };

    const handleSpeak = async () => {
        if(!text || loading) return;
        setLoading(true);
        setStatus('Initializing synthesis...');
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);

        try {
            setStatus('Generating audio waveform...');
            const audioBuffer = await generateSpeech(text, voice);
            
            setStatus('Encoding output...');
            const pcmData = new Int16Array(audioBuffer);
            const wavBlob = encodeWAV(pcmData, 24000);
            const url = URL.createObjectURL(wavBlob);
            setAudioUrl(url);
            setStatus('');
            
        } catch (e) {
            console.error(e);
            alert("Failed to generate speech. Please check logs.");
            setStatus('Error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    return (
        <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
            <div className="w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-nexus-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-accent via-purple-500 to-nexus-primary opacity-50"></div>
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-nexus-accent/20 rounded-xl text-nexus-accent">
                            <Volume2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-wide">Sonic Sphere</h2>
                            <p className="text-nexus-gray-400 text-sm">Neural Text-to-Speech Engine</p>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <select 
                            value={voice} 
                            onChange={(e) => setVoice(e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-nexus-gray-200 text-sm rounded-xl focus:ring-2 focus:ring-nexus-accent/50 focus:border-nexus-accent block w-64 p-3 appearance-none cursor-pointer hover:bg-slate-900 transition-colors pl-10 disabled:opacity-50"
                            disabled={loading}
                        >
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>{v.label}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-nexus-accent">
                             <Mic size={16} />
                        </div>
                    </div>
                </div>
                
                <div className="relative mb-8">
                    <textarea 
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-6 text-white min-h-[200px] focus:ring-2 focus:ring-nexus-accent/30 focus:border-nexus-accent/50 focus:outline-none resize-none placeholder-slate-600 font-mono text-sm leading-relaxed disabled:opacity-50"
                        placeholder="Enter text sequence for synthesis..."
                        disabled={loading}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono">
                        {text.length} chars
                    </div>
                </div>
                
                <button 
                    onClick={handleSpeak}
                    disabled={loading || !text}
                    className={`w-full bg-gradient-to-r from-nexus-accent to-purple-600 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-900/40 transform hover:scale-[1.01] active:scale-[0.99] ${loading ? 'opacity-80 cursor-wait' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>{status || 'Synthesizing Waveforms...'}</span>
                        </>
                    ) : (
                        <>
                            <Play fill="currentColor" size={20} /> Generate Speech
                        </>
                    )}
                </button>

                {audioUrl && (
                    <div className="mt-8 p-6 bg-slate-950 rounded-xl border border-nexus-border animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 mb-4">
                             <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                <FileAudio size={20} />
                             </div>
                             <div className="flex-1">
                                 <div className="text-sm font-bold text-white">Generation Complete</div>
                                 <div className="text-xs text-gray-500">24kHz • 16-bit • {voice} Voice</div>
                             </div>
                             <a 
                                href={audioUrl} 
                                download={`nexus-tts-${Date.now()}.wav`}
                                className="flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Download size={14} /> DOWNLOAD
                             </a>
                        </div>
                        <audio controls src={audioUrl} className="w-full h-10 accent-nexus-accent" autoPlay />
                    </div>
                )}
            </div>
        </div>
    )
}

export default TTS;