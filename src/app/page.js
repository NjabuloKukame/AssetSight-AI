import Link from 'next/link';
import { Box, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-8">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-sm text-black/80 font-medium">AI-Powered Training Platform</span>
          </div>
          <h1 className="text-6xl font-bold text-black mb-6 tracking-tight">
            Asset Sight AI Training
          </h1>
          <p className="text-xl text-black/60 max-w-2xl mx-auto">
            Experimental AI-Driven Tools For Human Learning and Training
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Link
            href="/prototype-1"
            className="group bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8 hover:border-black/20 transition-all flex flex-col"
          >
            <div className="mb-6">
              <div className="w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-7 h-7 text-black" />
              </div>
              <h2 className="text-2xl font-semibold text-black mb-3">
                AI-Generated 3D Learning Content
              </h2>
              <p className="text-black/60 leading-relaxed">
                Generate Interactive 3D Training Assets From Text or Images Using AI
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-black font-medium group-hover:gap-3 transition-all">
              <span>Open Tool</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            href="/prototype-2"
            className="group bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8 hover:border-black/20 transition-all flex flex-col"
          >
            <div className="mb-6">
              <div className="w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-black" />
              </div>
              <h2 className="text-2xl font-semibold text-black mb-3">
                AI Avatar Command & Animation
              </h2>
              <p className="text-black/60 leading-relaxed">
                Control A Learning Avatar Using Natural Language Commands
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-black font-medium group-hover:gap-3 transition-all">
              <span>Open Tool</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
