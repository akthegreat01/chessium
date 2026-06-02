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
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  const userProp = profile
    ? {
        name: profile.display_name || profile.username,
        avatar: profile.avatar_url,
        role: profile.role === "admin" ? "Admin" : "Free Plan",
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
            <div className="w-8 h-8 rounded-lg bg-[#81b64c] flex items-center justify-center text-white text-lg font-bold">
              ♞
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CHESS<span className="text-[#81b64c]">IUM</span>
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
