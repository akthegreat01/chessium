import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
      </div>
      
      {/* Top bar */}
      <header className="relative z-10 w-full px-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-5 h-5 flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <img src="/logo.png" alt="Chessium" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="text-[14px] font-medium text-secondary-foreground group-hover:text-foreground transition-colors duration-300">Chessium</span>
        </Link>
      </header>
      
      {/* Centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>

      {/* Bottom links */}
      <footer className="relative z-10 w-full px-8 pb-8 flex justify-center">
        <div className="flex items-center gap-6 text-[12px] text-secondary-foreground/50">
          <Link href="#" className="hover:text-secondary-foreground transition-colors duration-200">Privacy</Link>
          <Link href="#" className="hover:text-secondary-foreground transition-colors duration-200">Terms</Link>
          <span>© 2025 Chessium</span>
        </div>
      </footer>
    </div>
  );
}
