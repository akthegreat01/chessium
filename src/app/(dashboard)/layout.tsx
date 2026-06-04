import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  // Self-healing fallback: If profile is missing, create it dynamically
  if (!profile) {
    const rawUsername = user.user_metadata?.username || user.email?.split("@")[0] || "user";
    let sanitizedUsername = rawUsername.replace(/[^a-zA-Z0-9_]/g, "");
    if (sanitizedUsername.length < 3) {
      sanitizedUsername = `user_${user.id.substring(0, 8)}`;
    }
    
    let insertUsername = sanitizedUsername;
    let attempts = 0;
    let insertSuccess = false;
    let newProfile = null;
    
    while (!insertSuccess && attempts < 5) {
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: insertUsername,
          display_name: user.user_metadata?.display_name || user.user_metadata?.username || rawUsername,
        })
        .select("username, display_name, avatar_url, role")
        .single();
        
      if (!insertError && inserted) {
        newProfile = inserted;
        insertSuccess = true;
      } else {
        console.error("Profile auto-creation error:", insertError);
        if (insertError?.code === '23505') {
          insertUsername = `${sanitizedUsername}_${Math.floor(Math.random() * 10000)}`;
          attempts++;
        } else {
          break; // Stop retrying for RLS or other non-unique errors
        }
      }
    }
    
    if (newProfile) {
      profile = newProfile;
    }
  }

  const userProp = profile
    ? {
        name: profile.display_name || profile.username,
        avatar: profile.avatar_url,
        role: profile.role === "admin" ? "Admin" : "Player",
      }
    : { name: user.email?.split("@")[0] || "User" };

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex h-screen w-full bg-[#0a0a0b] text-white overflow-hidden">
      <Sidebar user={userProp} isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto">
        {/* We can place a top header here if needed for mobile, but Sidebar handles its own mobile toggle */}
        <div className="md:hidden h-16 border-b border-[#2a2a30] flex items-center justify-between px-4 bg-[#0a0a0b] sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Chessium Logo" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold tracking-tight text-white">
              CHESSIUM
            </span>
          </div>
        </div>
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
