import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Search, Bot, Puzzle, BookOpen, GraduationCap, FileText, Settings, User, LogIn, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";
import { headers } from "next/headers";
import ThemeSelector from "@/components/chess/ThemeSelector";
import { AdUnit } from "@/components/ui/AdUnit";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const headersList = await headers();
  const activePath = headersList.get("x-invoke-path") || "/home";

  return (
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on tablet/desktop */}
      <aside className="hidden md:flex w-16 lg:w-[220px] border-r border-border flex-col bg-surface shrink-0 z-20">
        
        {/* Brand */}
        <div className="h-14 flex items-center justify-center lg:justify-start px-5 border-b border-border shrink-0">
          <Link href="/home" className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Image src="/chessium_logo.png" alt="Chessium" width={20} height={20} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold tracking-[0.2em] uppercase hidden lg:block text-[11px]">Chessium</span>
          </Link>
        </div>
        
        {/* Main Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto scrollbar-none">
          <NavItem href="/home" active={activePath === "/home"} icon={<LayoutDashboard className="w-[18px] h-[18px]" />} label="Home" />
          <NavItem href="/analyze" active={activePath.includes("/analyze")} icon={<Search className="w-[18px] h-[18px]" />} label="Analyze" />
          <NavItem href="/play/ai" active={activePath.includes("/play")} icon={<Bot className="w-[18px] h-[18px]" />} label="Play vs AI" />
          <NavItem href="/puzzles" active={activePath.includes("/puzzles")} icon={<Puzzle className="w-[18px] h-[18px]" />} label="Puzzles" />
          
          <NavItem href="/vision" active={activePath.includes("/vision")} icon={<Search className="w-[18px] h-[18px]" />} label="Vision" />
          
          <div className="h-px bg-border my-3" />

          <NavItem href="/openings" active={activePath.includes("/openings")} icon={<BookOpen className="w-[18px] h-[18px]" />} label="Openings" />
          <NavItem href="/studies" active={activePath.includes("/studies")} icon={<BookOpen className="w-[18px] h-[18px]" />} label="Studies" />
          <NavItem href="/endgames" active={activePath.includes("/endgames")} icon={<Puzzle className="w-[18px] h-[18px]" />} label="Endgames" />
          <NavItem href="/learn" active={activePath.includes("/learn")} icon={<GraduationCap className="w-[18px] h-[18px]" />} label="Learn" />

          <div className="h-px bg-border my-3" />

          <NavItem href="/saved-analyses" active={activePath.includes("/saved-analyses")} icon={<FileText className="w-[18px] h-[18px]" />} label="My Analyses" />
          <NavItem href="/profile" active={activePath === "/profile"} icon={<User className="w-[18px] h-[18px]" />} label="Profile" />
          <ThemeSelector />
          <NavItem href="/settings" active={activePath === "/settings"} icon={<Settings className="w-[18px] h-[18px]" />} label="Settings" />
          
          <div className="mt-auto pt-6 px-2 hidden lg:block">
            <AdUnit className="w-full h-[120px] rounded-xl bg-white/[0.02] border border-border" />
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border shrink-0">
          {user ? (
            <form action={signout} className="w-full">
              <Button variant="ghost" type="submit" className="w-full justify-center lg:justify-start gap-2.5 hover:bg-white/5 text-secondary-foreground hover:text-foreground h-9 rounded-lg text-[13px] font-medium transition-all px-3">
                <LogOut className="w-[18px] h-[18px]" />
                <span className="hidden lg:inline-block">Sign Out</span>
              </Button>
            </form>
          ) : (
            <Link href="/login">
              <Button className="w-full justify-center lg:justify-start gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg text-[13px] font-semibold transition-all px-3">
                <LogIn className="w-[18px] h-[18px]" />
                <span className="hidden lg:inline-block">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background pb-16 md:pb-0 relative z-10">
        {children}
      </main>

      {/* Bottom Navigation Bar - Visible only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl border-t border-border flex items-center justify-around z-50 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <BottomNavItem href="/home" active={activePath === "/home"} icon={<LayoutDashboard className="w-5 h-5" />} label="Home" />
        <BottomNavItem href="/play/ai" active={activePath.includes("/play")} icon={<Bot className="w-5 h-5" />} label="Play" />
        <BottomNavItem href="/analyze" active={activePath.includes("/analyze")} icon={<Search className="w-5 h-5" />} label="Analyze" />
        <BottomNavItem href="/puzzles" active={activePath.includes("/puzzles")} icon={<Puzzle className="w-5 h-5" />} label="Puzzles" />
        <BottomNavItem href="/profile" active={activePath === "/profile"} icon={<User className="w-5 h-5" />} label="Profile" />
      </nav>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href}>
      <Button 
        variant="ghost" 
        className={`w-full justify-center lg:justify-start gap-2.5 h-9 rounded-lg px-3 text-[13px] transition-all
          ${active 
            ? "bg-white/10 text-foreground font-semibold" 
            : "hover:bg-white/5 text-secondary-foreground hover:text-foreground font-medium"
          }
        `}
      >
        {icon}
        <span className="hidden lg:inline-block">{label}</span>
      </Button>
    </Link>
  );
}

function BottomNavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className="flex-1 flex flex-col items-center justify-center gap-1 h-full py-1 tap-highlight-transparent">
      <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-primary/20 text-primary scale-110' : 'text-secondary-foreground/70 hover:text-foreground'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-wide transition-colors ${active ? 'text-primary' : 'text-secondary-foreground/70'}`}>
        {label}
      </span>
    </Link>
  );
}
