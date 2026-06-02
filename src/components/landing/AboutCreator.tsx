import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

export default function AboutCreator() {
  return (
    <section className="py-24 bg-[#0a0a0b] relative overflow-hidden border-t border-[#2a2a30]">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#81b64c] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 z-10 relative">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-[#81b64c] uppercase">About the Creator</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white">
              Meet Akshath Kataria
            </h3>
            
            <div className="space-y-4 text-[#a0a0a8] text-lg leading-relaxed">
              <p>
                Hi! I'm Akshath Kataria, the solo developer behind Chessium. 
                I built this platform because I felt the chess world needed a truly modern, 
                blistering fast, and aesthetically pleasing place to study and improve.
              </p>
              <p>
                Chessium combines cutting-edge web technologies like Next.js, WebAssembly, and Stockfish 16.1 
                with a hyper-focus on user experience. Everything from the 3-lives puzzle survival mode 
                to the instant engine analysis was designed to make your chess journey addictive and fun.
              </p>
              <p>
                When I'm not coding, I'm usually hanging pieces on move 6 or studying the Sicilian Defense. 
                Enjoy the platform, and may your rating always go up!
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-[400px] aspect-square relative rounded-3xl overflow-hidden border border-[#2a2a30] shadow-[0_0_50px_rgba(129,182,76,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] to-transparent z-10"></div>
            {/* Fallback pattern if we don't have an actual photo */}
            <div className="w-full h-full bg-[#141416] flex items-center justify-center text-[#2a2a30]">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>
              </svg>
            </div>
            <div className="absolute bottom-6 left-6 z-20">
              <div className="text-2xl font-bold text-white mb-1">Akshath Kataria</div>
              <div className="text-sm font-medium text-[#81b64c]">Founder & Lead Developer</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
