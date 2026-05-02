import { Heart, Star, Code, Coffee, Shield } from 'lucide-react';
import Image from 'next/image';

export default function SupportPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Gold ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(139,92,246,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-3xl w-full mt-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-black tracking-widest uppercase" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37', boxShadow: '0 0 20px rgba(212,175,55,0.1)' }}>
            <Heart className="w-3.5 h-3.5 fill-current" />
            Support Chessium
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Keep the Engine{' '}
            <span style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #d4af37 40%, #b8962e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Running
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-lg font-medium">
            Chessium is built with passion to provide an elite, distraction-free analysis experience. 
            Your support helps keep this project alive and growing.
          </p>
        </div>

        {/* Main card */}
        <div className="glass-panel p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.04)' }}>
          {/* Gold gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 50%)' }} />

          {/* Left: QR Code */}
          <div className="w-full md:w-auto flex flex-col items-center relative z-10">
            <div className="relative">
              {/* Glow behind QR */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'rgba(212,175,55,0.2)', filter: 'blur(30px)' }} />
              <div className="relative bg-white p-4 rounded-2xl shadow-2xl" style={{ border: '2px solid rgba(212,175,55,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <Image 
                  src="/qr2.png" 
                  alt="Support QR Code" 
                  width={200} 
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
            <p className="mt-4 text-xs font-black tracking-widest uppercase" style={{ color: '#d4af37' }}>Scan to support</p>
          </div>

          {/* Right: Info */}
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            <div className="flex flex-col gap-5">
              {[
                { icon: Coffee, title: "Fund Development", desc: "Every contribution goes directly towards improving analysis accuracy, adding features, and maintaining performance." },
                { icon: Code, title: "Open Source Spirit", desc: "Chessium is built openly. Your support enables us to keep it free and accessible to every player." },
                { icon: Star, title: "Premium Features", desc: "Support helps fund advanced features like opening databases, endgame tablebases, and cloud sync." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 transition-all group-hover:scale-110" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.18)', boxShadow: '0 0 0 rgba(212,175,55,0)' }}>
                    <item.icon className="w-5 h-5" style={{ color: '#d4af37' }} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-black text-white text-sm mb-1 tracking-tight">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t" style={{ borderColor: 'rgba(212,175,55,0.08)' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />
                <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Thank you for supporting independent chess software. Every bit helps! ♟
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Creator credit */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium" style={{ color: 'rgba(212,175,55,0.35)' }}>
            Chessium · Created by <span style={{ color: 'rgba(212,175,55,0.6)' }}>Akshath Kataria</span> · Built with passion for chess
          </p>
        </div>
      </div>
    </div>
  );
}
