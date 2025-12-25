import React, { useState, useEffect, useRef } from 'react';
import { generateVideo } from '../services/geminiService';
import { Video, Film, AlertTriangle, Key, Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

const VideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(has);
    } else {
        setHasKey(true);
    }
  };

  const handleSelectKey = async () => {
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
          await (window as any).aistudio.openSelectKey();
          setHasKey(true);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setUploadedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    setVideoUrl(null);
    setStatus('Initializing Veo engine...');

    try {
      setStatus('Generating video... This may take a few minutes.');
      const url = await generateVideo(prompt, uploadedImage || undefined);
      setVideoUrl(url);
      setStatus('Completed!');
    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes("Requested entity was not found")) {
          setHasKey(false);
          setStatus('API Key error. Please select a valid key.');
      } else {
          setStatus('Generation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
      return (
          <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 shadow-2xl text-center max-w-md">
                  <Key className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
                  <p className="text-gray-400 mb-6">
                      To use Veo 3.1 for video generation, you must select a paid API key from your Google Cloud project.
                  </p>
                  <button
                    onClick={handleSelectKey}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-900/50"
                  >
                      Select API Key
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-purple-300">
                          View Billing Documentation
                      </a>
                  </p>
              </div>
          </div>
      );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Film className="text-purple-400" size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Motion Lab</h2>
                    <p className="text-purple-300 text-sm">Powered by Veo 3.1</p>
                </div>
            </div>

            <div className="space-y-6">
                <div 
                    onClick={() => !loading && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer group flex items-center justify-center min-h-[100px] ${
                        uploadedImage ? 'border-purple-500/50 bg-black/50' : 'border-slate-700 hover:border-purple-500/50 bg-slate-950/30'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*" 
                        disabled={loading}
                    />
                    
                    {uploadedImage ? (
                        <div className="relative w-full h-48 flex items-center justify-center">
                            <img src={uploadedImage} alt="Reference" className="max-h-full max-w-full rounded-lg shadow-lg" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className="bg-black/70 text-purple-300 text-xs px-2 py-1 rounded">Start Frame</span>
                                {!loading && (
                                    <button 
                                        onClick={clearImage}
                                        className="p-1 bg-red-500/80 rounded-full hover:bg-red-500 text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 mx-auto flex items-center justify-center group-hover:bg-purple-900/30 transition-colors">
                                <ImageIcon size={20} className="text-gray-400 group-hover:text-purple-400" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Upload Reference Image (Optional)</p>
                            <p className="text-xs text-gray-600">Use this image as the starting frame for your video.</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Video Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-slate-950/50 border border-purple-500/30 rounded-xl p-4 text-white h-32 focus:ring-2 focus:ring-purple-500/50 focus:outline-none placeholder-slate-600 disabled:opacity-50"
                        placeholder="Describe the motion and scene. E.g., A cinematic drone shot of this landscape..."
                        disabled={loading}
                    />
                </div>

                <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 flex gap-3 items-start">
                    <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
                    <p className="text-sm text-amber-200">
                        Veo video generation can take several minutes. Please keep this tab open.
                    </p>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                        loading 
                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50'
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin" size={24} />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        <>
                            <Video size={20} /> Generate 720p Video
                        </>
                    )}
                </button>

                {status && (
                    <div className="text-center text-sm font-mono text-purple-300 animate-pulse bg-purple-900/10 py-3 rounded border border-purple-500/20">
                        {status}
                    </div>
                )}

                {videoUrl && (
                    <div className="mt-8 rounded-xl overflow-hidden border border-purple-500/30 bg-black aspect-video shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                        <video controls className="w-full h-full" autoPlay loop>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default VideoGen;