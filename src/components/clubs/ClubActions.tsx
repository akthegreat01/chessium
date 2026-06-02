"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinClubAction } from "@/app/(dashboard)/clubs/[slug]/actions";

export default function ClubActions({ clubId, clubSlug, isMember }: { clubId: string, clubSlug: string, isMember: boolean }) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleJoin = async () => {
    setIsJoining(true);
    await joinClubAction(clubId);
    setIsJoining(false);
  };

  const handleInvite = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  if (isMember) {
    return (
      <button 
        onClick={handleInvite}
        className="px-8 py-3 bg-[#1a1a1f] border border-[#2a2a30] hover:bg-[#2a2a30] text-white font-bold rounded-xl transition-all shadow-elevated flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {copied ? "Link Copied!" : "Invite Friends"}
      </button>
    );
  }

  return (
    <button 
      onClick={handleJoin}
      disabled={isJoining}
      className="px-8 py-3 bg-[#81b64c] hover:bg-[#9fcc6b] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(129,182,76,0.3)] hover:-translate-y-0.5"
    >
      {isJoining ? "Joining..." : "Join Club"}
    </button>
  );
}
