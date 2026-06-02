"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinClubAction, deleteClubAction } from "@/app/(dashboard)/clubs/[slug]/actions";

export default function ClubActions({ clubId, clubSlug, isMember, isOwner = false }: { clubId: string, clubSlug: string, isMember: boolean, isOwner?: boolean }) {
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

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this club? This action cannot be undone.")) {
      const res = await deleteClubAction(clubId);
      if (!res?.error) {
        router.push("/clubs");
      } else {
        alert(res.error);
      }
    }
  };

  if (isMember) {
    return (
      <div className="flex flex-col md:flex-row gap-3">
        {isOwner && (
          <button 
            onClick={handleDelete}
            className="px-6 py-3 bg-[#ca3431]/10 border border-[#ca3431]/30 hover:bg-[#ca3431]/20 text-[#ca3431] font-bold rounded-xl transition-all shadow-elevated flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Club
          </button>
        )}
        <button 
          onClick={handleInvite}
          className="px-8 py-3 bg-[#1a1a1f] border border-[#2a2a30] hover:bg-[#2a2a30] text-white font-bold rounded-xl transition-all shadow-elevated flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {copied ? "Link Copied!" : "Invite Friends"}
        </button>
      </div>
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
