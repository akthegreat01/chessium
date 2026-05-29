import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Play, Puzzle, Settings, User, LineChart, LogIn, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 border-r border-white/5 flex flex-col justify-between py-6 bg-surface/30 backdrop-blur-3xl transition-all z-20">
        <div>
          <div className="px-6 mb-10 flex items-center justify-center md:justify-start">
            <Link href="/home" className="font-semibold text-2xl tracking-tight hidden md:block">Chessium</Link>
            <Link href="/home" className="font-bold text-2xl tracking-tight md:hidden">C</Link>
          </div>
          <nav className="flex flex-col gap-1 px-4">
            <NavItem href="/home" icon={<LayoutDashboard className="w-5 h-5" />} label="Home" />
            <NavItem href="/analyze" icon={<LineChart className="w-5 h-5" />} label="Analyze" />
            <NavItem href="/play" icon={<Play className="w-5 h-5" />} label="Play" />
            <NavItem href="/puzzles" icon={<Puzzle className="w-5 h-5" />} label="Puzzles" />
          </nav>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {user ? (
            <>
              <NavItem href="/profile" icon={<User className="w-5 h-5" />} label="Profile" />
              <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
              <form action={signout} className="w-full">
                <Button variant="ghost" type="submit" className="w-full justify-center md:justify-start gap-4 hover:bg-destructive/10 text-destructive/80 hover:text-destructive h-12 rounded-xl text-base font-medium transition-all">
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline-block">Sign Out</span>
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button className="w-full justify-center md:justify-start gap-4 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-semibold transition-all">
                <LogIn className="w-5 h-5" />
                <span className="hidden md:inline-block">Sign In</span>
              </Button>
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none" />
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-center md:justify-start gap-4 hover:bg-white/5 text-secondary-foreground hover:text-foreground h-12 rounded-xl text-base font-medium transition-all">
        {icon}
        <span className="hidden md:inline-block">{label}</span>
      </Button>
    </Link>
  );
}
