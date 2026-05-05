"use client";

import Link from 'next/link';
import { Mail, Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-md mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" className="w-6 h-6 fill-[#d4af37]">
                <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
                <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
              </svg>
              <span className="font-black text-lg tracking-tight text-white">Chessium</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              High-performance chess analysis engine powered by Stockfish. 
              Designed for players who demand precision and beauty in their tactical laboratory.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/analysis" className="text-gray-400 hover:text-white transition-colors text-sm">Analysis Board</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Project</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support Us</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Legal</h3>
            <ul className="space-y-4 mb-8">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
            <div className="flex items-center gap-4">
              <a href="mailto:contact@chessium.app" className="text-gray-500 hover:text-[#d4af37] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com/akshathkataria" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/akshath_kataria" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DA1F2] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-medium">
            &copy; {currentYear} Chessium. Built with <Heart className="w-3 h-3 inline text-red-500 mx-0.5" /> by Akshath Kataria.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Version 2.4.0-PRO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
