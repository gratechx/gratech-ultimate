import React, { useState } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { Image as ImageIcon, Wand2, Download, Upload, X, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang?: Language; // Made optional to fix potential usage issues, imported from types
}

const ImageGen: React.FC<Props> = ({ lang }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResultImage(null);

    try {
      if (mode === 'create') {
        setLoadingStep('Initializing model parameters...');
        await new Promise(r => setTimeout(r, 500));
        setLoadingStep('Synthesizing visual data...');
        const images = await generateImage(prompt, aspectRatio, '1K', false); 
        if (images.length > 0) {
          setLoadingStep('Rendering output...');
          setResultImage(images[0]);
        }
      } else if (mode === 'edit' && uploadedImage) {
        setLoadingStep('Uploading source asset...');
        await new Promise(r => setTimeout(r, 500));
        setLoadingStep('Applying transformations...');
        const mimeType = uploadedImage.split(';')[0].split(':')[1];
        const base64Data = uploadedImage.split(',')[1];
        const result = await editImage(base64Data, prompt, mimeType);
        if (result) {
            setResultImage(result);
        } else {
            alert("Editing failed. Please try a different prompt or image.");
        }
      }
    } catch (error) {
      alert("Failed to process image. See console.");
    } finally {
      setLoading(false);
      setLoadingStep('');
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

  const clearUpload = (e: React.MouseEvent) => {
      e.stopPropagation();
      setUploadedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-nexus-secondary" />
            Visionary Studio
        </h2>
        <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
                onClick={() => setMode('create')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'create' ? 'bg-nexus-secondary text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                Create (Pro)
            </button>
            <button 
                onClick={() => setMode('edit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-nexus-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                Edit (Nano Banana)
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-nexus-border">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {mode === 'create' ? 'Imagine a scene...' : 'Describe the edit...'}
                </label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white h-32 focus:ring-2 focus:ring-nexus-secondary/50 focus:outline-none resize-none disabled:opacity-50"
                    placeholder={mode === 'create' ? "A futuristic city in the desert, neon lights, cyberpunk style..." : "Add a retro filter, remove background..."}
                    disabled={loading}
                />

                {mode === 'create' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
                        <select 
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white disabled:opacity-50"
                            disabled={loading}
                        >
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3 (Classic)</option>
                            <option value="3:4">3:4 (Vertical)</option>
                        </select>
                    </div>
                )}

                {mode === 'edit' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Source Image</label>
                        <div 
                            onClick={() => !loading && fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors h-48 flex flex-col items-center justify-center relative overflow-hidden group ${
                                uploadedImage ? 'border-nexus-primary bg-black/50' : 'border-slate-700 hover:border-nexus-primary'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploadedImage ? (
                                <>
                                    <img src={uploadedImage} className="absolute inset-0 w-full h-full object-contain p-2" alt="Source" />
                                    {!loading && (
                                        <button 
                                            onClick={clearUpload}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors z-20 shadow-lg"
                                            title="Remove Image"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Upload className="mb-2 text-gray-400 group-hover:text-nexus-primary transition-colors" />
                                    <span className="text-xs text-gray-400 relative z-10">Click to upload image</span>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                                disabled={loading}
                            />
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt || (mode === 'edit' && !uploadedImage)}
                    className={`mt-6 w-full py-3 rounded-lg font-bold text-slate-900 transition-all flex items-center justify-center gap-2 ${
                        loading ? 'bg-gray-600 cursor-not-allowed' : 
                        mode === 'create' ? 'bg-nexus-secondary hover:bg-cyan-400' : 'bg-nexus-primary hover:bg-emerald-400'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Wand2 size={20} />
                            {mode === 'create' ? 'Generate' : 'Transform'}
                        </>
                    )}
                </button>
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-nexus-border flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
            {loading ? (
                <div className="flex flex-col items-center gap-4 p-8 text-center animate-in fade-in duration-300">
                     <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-nexus-primary border-t-transparent rounded-full animate-spin"></div>
                     </div>
                     <p className="text-nexus-primary font-mono animate-pulse">{loadingStep}</p>
                </div>
            ) : resultImage ? (
                <>
                    <img src={resultImage} alt="Generated" className="w-full h-full object-contain animate-in zoom-in-95 duration-500" />
                    <a 
                        href={resultImage} 
                        download={`gratech-${Date.now()}.png`}
                        className="absolute bottom-4 right-4 p-3 bg-nexus-surface/80 backdrop-blur rounded-full text-white hover:bg-nexus-primary hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                        <Download size={20} />
                    </a>
                </>
            ) : (
                <div className="text-gray-600 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-4 opacity-20" />
                    <span>Your creation will appear here</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageGen;