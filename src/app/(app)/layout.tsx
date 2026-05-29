import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Search, Bot, Puzzle, BookOpen, GraduationCap, FileText, Settings, User, LogIn, LogOut, Crown, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";
import { headers } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Quick way to get current pathname in server component to highlight active nav
  const headersList = await headers();
  const activePath = headersList.get("x-invoke-path") || "/home";

  return (
    <div className="flex h-screen bg-[#0a0d14] text-foreground overflow-hidden selection:bg-primary/20">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 border-r border-[#1e2433] flex flex-col justify-between py-6 bg-[#121620] transition-all z-20 shadow-2xl shadow-black/50">
        <div>
          <div className="px-6 mb-10 flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Chessium Logo" className="w-full h-full object-contain" />
            </div>
            <Link href="/home" className="font-bold text-xl tracking-[0.2em] uppercase hidden md:block text-foreground">Chessium</Link>
          </div>
          
          <nav className="flex flex-col gap-1 px-4">
            <NavItem href="/home" active={activePath === "/home"} icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
            <NavItem href="/analyze" active={activePath.includes("/analyze")} icon={<Search className="w-5 h-5" />} label="Analyze" />
            <NavItem href="/play/ai" active={activePath.includes("/play")} icon={<Bot className="w-5 h-5" />} label="Play vs AI" />
            <NavItem href="/puzzles" active={activePath.includes("/puzzles")} icon={<Puzzle className="w-5 h-5" />} label="Puzzles" />
            <NavItem href="/openings" active={activePath.includes("/openings")} icon={<BookOpen className="w-5 h-5" />} label="Openings" />
            <NavItem href="/learn" active={activePath.includes("/learn")} icon={<GraduationCap className="w-5 h-5" />} label="Learn" />
            <NavItem href="/saved-analyses" active={activePath.includes("/saved-analyses")} icon={<FileText className="w-5 h-5" />} label="My Analyses" />
          </nav>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <nav className="flex flex-col gap-1 mb-4 border-t border-[#1e2433] pt-4">
            {user ? (
              <>
                <NavItem href="/profile" active={activePath === "/profile"} icon={<User className="w-5 h-5" />} label="Profile" />
                <NavItem href="/settings" active={activePath === "/settings"} icon={<Settings className="w-5 h-5" />} label="Settings" />
                <form action={signout} className="w-full">
                  <Button variant="ghost" type="submit" className="w-full justify-center md:justify-start gap-4 hover:bg-destructive/10 text-destructive/80 hover:text-destructive h-12 rounded-xl text-[15px] font-medium transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline-block">Sign Out</span>
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button className="w-full justify-center md:justify-start gap-4 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-[15px] font-semibold transition-all">
                  <LogIn className="w-5 h-5" />
                  <span className="hidden md:inline-block">Sign In</span>
                </Button>
              </Link>
            )}
          </nav>

          {/* User Widget matching Figma */}
          {user && (
            <div className="hidden md:flex items-center gap-3 p-3 rounded-2xl bg-[#0a0d14] border border-[#1e2433] cursor-pointer hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-bold text-foreground truncate">{user.email?.split('@')[0] || "Player"}</div>
                <div className="text-xs font-semibold text-secondary-foreground flex items-center gap-1 mt-0.5">
                  1947 <Zap className="w-3 h-3 text-primary" fill="currentColor" />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0d14] relative">
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href}>
      <Button 
        variant="ghost" 
        className={`w-full justify-center md:justify-start gap-4 h-12 rounded-xl text-[15px] transition-all
          ${active 
            ? "bg-primary/10 text-primary font-bold hover:bg-primary/20 hover:text-primary" 
            : "hover:bg-white/5 text-secondary-foreground hover:text-foreground font-medium"
          }
        `}
      >
        {icon}
        <span className="hidden md:inline-block">{label}</span>
      </Button>
    </Link>
  );
}
