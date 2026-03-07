"use client"

import { useState, useRef } from 'react';
import { Sparkles, RotateCw, ZoomIn, RefreshCw, ZoomOut, Upload } from 'lucide-react';
import ModelViewer from '../components/ModelViewer/ModelViewer';
import { ASSET_MAP } from '../lib/assets';

export default function Prototype1() {
    const [textInput, setTextInput] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [modelUrl, setModelUrl] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewerMessage, setViewerMessage] = useState(
        'Generate An Asset To View It Here'
    );
    const viewerRef = useRef(null);

    const generateFromObjectName = async (objectName) => {
        setIsLoading(true);
        setError('');
        setAiSummary('');
        setModelUrl(null);

        try {
            const response = await fetch('/api/ai-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objectName }),
            });

            const data = await response.json();

            setAiSummary(data.summary);

            if (data.assetKey !== 'unsupported' && ASSET_MAP[data.assetKey]) {
                setModelUrl(ASSET_MAP[data.assetKey].url);
                setViewerMessage('');
            } else {
                setViewerMessage(
                    'This object is not supported yet. Try a fire extinguisher or wet floor sign.'
                );
            }
        } catch {
            setError('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleGenerate = async () => {
        if (!textInput.trim()) {
            setError('Please describe an object or upload an image.');
            return;
        }

        generateFromObjectName(textInput);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFileName(file.name);
        setIsLoading(true);
        setError('');

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                const response = await fetch('/api/image-classify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: reader.result }),
                });

                const data = await response.json();

                if (!data.label) {
                    setViewerMessage('Could not identify the object in the image.');
                    setIsLoading(false);
                    return;
                }

                setTextInput(data.label);

                await generateFromObjectName(data.label);

            } catch {
                setError('Failed to analyze the image.');
                setIsLoading(false);
            }
        };

        reader.readAsDataURL(file);
    };




    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="mb-8 sm:mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-2">
                        <Sparkles className="w-4 h-4 text-black" />
                        <span className="text-xs sm:text-sm text-black/80 font-medium">AI-Powered 3D Generation</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 tracking-tight">
                        Generate 3D Training Asset
                    </h1>
                    <p className="text-black/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
                        Create interactive 3D models for your training modules
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8 space-y-4 sm:space-y-6">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="Describe an object to generate..."
                                className="w-full px-6 py-4 bg-white/40 border border-black/20 rounded-xl text-black placeholder:text-black/40 focus:outline-none focus:border-black/40 transition-all"
                            />

                            <div className="relative">
                                <label className="w-full px-6 py-4 border-2 border-dashed border-black/20 rounded-xl hover:border-black/40 transition-all flex items-center justify-center gap-2 text-black/60 hover:text-black cursor-pointer">
                                    <Upload className="w-5 h-5" />
                                    <span>{uploadedFileName || 'Upload Image (Optional)'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isLoading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Generating…' : 'Generate Asset'}
                            </button>
                        </div>

                        {(isLoading || aiSummary || error) && (
                            <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2 bg-black/10 rounded-lg">
                                        <Sparkles className="w-5 h-5 text-black" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">
                                        AI Educational Summary
                                    </h3>
                                </div>

                                {isLoading && (
                                    <p className="text-black/60 animate-pulse">
                                        Generating Educational Summary…
                                    </p>
                                )}

                                {error && (
                                    <p className="text-red-600">{error}</p>
                                )}

                                {aiSummary && !isLoading && (
                                    <p className="text-black/80 leading-relaxed">
                                        {aiSummary}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8">
                            <h3 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6">
                                Quick Commands
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                {[
                                    'Fire Extinguisher',
                                    'Drill',
                                    'Toolbox',
                                    'Wet Floor Sign',
                                    'Measuring Tape',
                                    'Boombox',
                                    'Camera',
                                    'Wheelchair',
                                    'Light Bulb',
                                    'Table',
                                    'Potted Plant',
                                    'Security Camera',
                                    'Chair',
                                    'Tyre',
                                    'Alarm Clock',
                                    'Guitar',
                                ].map((example) => (
                                    <button
                                        key={example}
                                        onClick={() => setTextInput(example)}
                                        className="px-2 sm:px-3 py-2 sm:py-2.5 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 rounded-lg text-xs sm:text-sm text-black/80 hover:text-black transition-all text-left leading-tight"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-black">
                                3D Preview
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => viewerRef.current?.rotate()}
                                    className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                                    title="Rotate"
                                >
                                    <RotateCw className="w-5 h-5 text-black/80" />
                                </button>

                                <button
                                    onClick={() => viewerRef.current?.zoomOut()}
                                    className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-5 h-5 text-black/80" />
                                </button>

                                <button
                                    onClick={() => viewerRef.current?.zoomIn()}
                                    className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-5 h-5 text-black/80" />
                                </button>

                                <button
                                    onClick={() => viewerRef.current?.reset()}
                                    className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                                    title="Reset"
                                >
                                    <RefreshCw className="w-5 h-5 text-black/80" />
                                </button>
                            </div>
                        </div>

                        <div className="aspect-square rounded-xl overflow-hidden bg-white/40 border border-black/10">
                            {modelUrl ? (
                                <ModelViewer ref={viewerRef} modelUrl={modelUrl} />
                            ) : (
                                <p className="text-black/50 flex items-center justify-center h-full text-center px-4">
                                    {viewerMessage}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-sm text-black/60">
                                Real-time 3D generation active
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
