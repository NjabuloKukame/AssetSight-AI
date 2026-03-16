"use client"

import { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, RefreshCw, ZoomOut, Sparkles, Send, Loader2 } from 'lucide-react';
import AvatarViewer from '../components/AvatarViewer/AvatarViewer';

export default function Prototype2() {
  const [command, setCommand] = useState('');
  const [executedCommand, setExecutedCommand] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [countdown, setCountdown] = useState(15);

  const viewerRef = useRef(null);

  useEffect(() => {
    if (!showHint) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowHint(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showHint]);

  const handleExecute = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/interpret-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const data = await res.json();

      setExecutedCommand(command);
      setAiExplanation(data.summary);

      // Handle sequence or single action
      if (data.actions && Array.isArray(data.actions)) {
        viewerRef.current?.playAnimationSequence(data.actions);
      } else {
        viewerRef.current?.playAnimation(data.action);
      }

    } catch (err) {
      console.error(err);
      setAiExplanation(
        'The avatar remains idle as the command could not be interpreted.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-xs sm:text-sm text-black/80 font-medium">AI-Powered Avatar Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 tracking-tight">
            Command the Training Avatar
          </h1>
          <p className="text-black/60 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Use natural language to control avatar actions in real-time. Chaining supported!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                  placeholder="Describe what the avatar should do..."
                  className="w-full px-6 py-4 bg-white/40 border border-black/20 rounded-xl text-black placeholder:text-black/40 focus:outline-none focus:border-black/40 transition-all"
                />
              </div>

              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Command</span>
                  </>
                ) : (
                  <>
                    <span>Execute Command</span>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
            {showHint && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-blue-900">
                        Chain Animations
                      </h3>
                      <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded shrink-0">
                        {countdown}s
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 mb-3 leading-relaxed">
                      You Can Chain Multiple Animations Using Natural Language Connectors Like <span className="font-mono bg-white px-2 py-1 rounded">"then"</span>, <span className="font-mono bg-white px-2 py-1 rounded">"and"</span>, or <span className="font-mono bg-white px-2 py-1 rounded">"followed by"</span>.
                    </p>
                    <div className="text-xs sm:text-sm text-blue-800">
                      <span className="font-semibold">Examples:</span>
                      <ul className="text-sm text-blue-800 space-y-1 ml-2">
                        <li>✓ <span className="font-mono bg-white px-1.5 py-0.5 rounded text-xs">"Walk Then Wave"</span></li>
                        <li>✓ <span className="font-mono bg-white px-1.5 py-0.5 rounded text-xs">"Jog And Salute And Point"</span></li>
                        <li>✓ <span className="font-mono bg-white px-1.5 py-0.5 rounded text-xs">"Dance Followed by Jump"</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {executedCommand && (
              <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-black/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-1">
                      AI Response
                    </h3>
                    <p className="text-sm text-black/50">Interpreted: "{executedCommand}"</p>
                  </div>
                </div>
                <p className="text-black/80 leading-relaxed">{aiExplanation}</p>
              </div>
            )}

            <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6">
                Quick Commands
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  'Wave',
                  'Jump',
                  'Dance',
                  'Walk',
                  'Walk Backwards',
                  'Point',
                  'Salute',
                  'Drop Kick',
                  'Climb',
                  'Jog',
                  'Walk Then Point',
                  'Jog Then Salute Then Wave',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setCommand(example)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 rounded-lg text-xs sm:text-sm text-black/80 hover:text-black transition-all text-left leading-tight"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 sm:p-8">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-black">
                Live Preview
              </h2>
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => viewerRef.current?.toggleRotate()}
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
              <AvatarViewer ref={viewerRef} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-black/60">
                Real-time AI interpretation active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

