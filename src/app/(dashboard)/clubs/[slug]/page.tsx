import React from "react";
import Link from "next/link";
import { getClubBySlug, getClubMembers } from "@/lib/chess/clubs-db";
import LiveLeaderboard from "@/components/clubs/LiveLeaderboard";
import AdSlot from "@/components/ui/AdSlot";
import ClubActions from "@/components/clubs/ClubActions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ClubDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) {
    return <div className="text-center p-12 text-[#a0a0a8]">Club not found.</div>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const members = await getClubMembers(club.id);
  const isMember = user ? members.some(m => m.user_id === user.id) : false;
  const isOwner = user ? club.owner_id === user.id : false;

  // Fallback: If owner is missing from members list (e.g. due to RLS during creation), inject them manually
  if (isOwner && !isMember && user) {
    const { data: profile } = await supabase.from('profiles').select('username, chess_com_username').eq('id', user.id).single();
    const fallbackUsername = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Owner';
    members.push({
      id: 'owner-temp',
      user_id: user.id,
      role: 'owner',
      username: fallbackUsername,
      chessComUsername: profile?.chess_com_username || null
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/clubs" className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-6 inline-block">
          ← Back to Clubs
        </Link>
        
        <div className="bg-[#141416] border border-[#2a2a30] rounded-3xl p-8 shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#81b64c]/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{club.name}</h1>
                <span className="px-3 py-1 bg-[#1a1a1f] border border-[#2a2a30] rounded-full text-xs font-bold text-[#a0a0a8]">
                  {club.member_count} Members
                </span>
              </div>
              <p className="text-[#a0a0a8] max-w-xl text-lg">
                {club.description}
              </p>
            </div>
            
            <ClubActions clubId={club.id} clubSlug={club.slug} isMember={isMember} isOwner={isOwner} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LiveLeaderboard members={members} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated">
            <h3 className="font-bold text-white mb-4">About the Leaderboard</h3>
            <p className="text-sm text-[#a0a0a8] leading-relaxed">
              This leaderboard connects directly to the Chess.com public API. Member ratings for Rapid and Blitz are fetched in real-time when you load this page. Ensure your Chess.com username is linked in your profile to appear on the board!
            </p>
          </div>
          <AdSlot format="square" />
        </div>
      </div>
    </div>
  );
}
