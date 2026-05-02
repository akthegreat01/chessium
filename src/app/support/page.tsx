import { Heart, Star, Code, Coffee } from 'lucide-react';
import Image from 'next/image';

export default function SupportPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-600/[0.08] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/[0.06] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full mt-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            Support Chessium
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Keep the Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Running</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-lg">
            Chessium is built with passion to provide an elite, ad-free analysis experience. 
            Your support helps keep this project alive and growing.
          </p>
        </div>

        {/* Main card */}
        <div className="glass-panel p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center border border-white/5 shadow-2xl">
          
          {/* Left: QR Code */}
          <div className="w-full md:w-auto flex flex-col items-center">
            <div className="relative">
              {/* Glow behind QR */}
              <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-3xl pointer-events-none" />
              <div className="relative bg-white p-4 rounded-2xl shadow-2xl shadow-black border border-white/20">
                <Image 
                  src="/qr2.png" 
                  alt="Support QR Code" 
                  width={200} 
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
            <p className="mt-4 text-xs font-bold tracking-widest uppercase text-blue-400">Scan to support</p>
          </div>

          {/* Right: Info */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {[
                { icon: Coffee, title: "Fund Development", desc: "Every contribution goes directly towards improving analysis accuracy, adding features, and maintaining performance." },
                { icon: Code, title: "Open Source", desc: "Chessium is built openly. Your support enables us to keep it free and accessible to every player." },
                { icon: Star, title: "Premium Features", desc: "Support helps fund advanced features like opening databases, endgame tablebases, and cloud sync." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0 group-hover:scale-110 group-hover:border-blue-500/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-gray-600 italic">
                Thank you for supporting independent chess software. Every bit helps! ♟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
