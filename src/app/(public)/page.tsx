import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import LandingContent from "@/components/home/LandingContent";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chessium | Best Free Chess Platform & Stockfish 18 Analysis",
  description: "Join Chessium to get absolutely free, unlimited Stockfish 18 game analysis. Play against AI, solve tactics, and learn master-level openings.",
  openGraph: {
    title: "Chessium | Best Free Chess Platform",
    description: "Join Chessium to get absolutely free, unlimited Stockfish 18 game analysis.",
    url: "https://chessium.in",
  },
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background font-sans antialiased">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background ">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <Image src="/chessium_logo.png" alt="Chessium" width={24} height={24} className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold tracking-wide text-foreground text-[15px]">Chessium</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[13px] font-medium text-secondary-foreground hover:text-foreground transition-colors duration-200">Features</Link>

            <Link href="#pricing" className="text-[13px] font-medium text-secondary-foreground hover:text-foreground transition-colors duration-200">Pricing</Link>
            <Link href="/blog" className="text-[13px] font-medium text-secondary-foreground hover:text-foreground transition-colors duration-200">About</Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/home" className="text-[13px] font-semibold bg-foreground text-background px-5 py-2 rounded-md hover:bg-foreground/90 transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[13px] font-medium text-secondary-foreground hover:text-foreground transition-colors duration-200">Sign In</Link>
                <Link href="/signup" className="text-[13px] font-semibold bg-foreground text-background px-5 py-2 rounded-md hover:bg-foreground/90 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <LandingContent user={user} />
    </main>
  );
}
