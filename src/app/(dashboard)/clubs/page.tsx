import React from "react";
import Link from "next/link";
import { getClubs } from "@/lib/chess/clubs-db";

export default async function ClubsDirectoryPage() {
  const clubs = await getClubs();

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
          Chessium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81b64c] to-[#9fcc6b]">Clubs</span>
        </h1>
        <p className="text-[#a0a0a8] text-lg max-w-2xl mx-auto">
          Join a community, compete on live leaderboards, and rise through the ranks together.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/clubs/create" className="px-6 py-3 bg-[#81b64c] hover:bg-[#9fcc6b] text-white font-bold rounded-xl transition-colors shadow-elevated">
            Create a Club
          </Link>
          <Link href="#explore" className="px-6 py-3 bg-[#141416] border border-[#2a2a30] hover:bg-[#1a1a1f] text-white font-bold rounded-xl transition-colors">
            Explore Clubs
          </Link>
        </div>
      </div>

      <div id="explore" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, i) => (
          <Link href={`/clubs/${club.slug}`} key={club.id} className="group block">
            <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 h-full shadow-elevated transition-transform group-hover:-translate-y-1 group-hover:border-[#81b64c]/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <svg className="w-24 h-24 text-[#81b64c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.5 8.5 3 9l5 4.5L6.5 20 12 16.5 17.5 20 16 13.5l5-4.5-6.5-.5L12 2z"/>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 relative z-10 group-hover:text-[#81b64c] transition-colors">{club.name}</h2>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="px-2 py-1 bg-[#1a1a1f] rounded text-xs font-bold text-[#a0a0a8] border border-[#2a2a30]">
                  {club.member_count} members
                </span>
              </div>
              <p className="text-[#8a8a93] text-sm leading-relaxed relative z-10 line-clamp-3">
                {club.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
