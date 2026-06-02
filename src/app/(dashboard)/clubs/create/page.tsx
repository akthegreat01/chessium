"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import AdSlot from "@/components/ui/AdSlot";
import { createClubAction } from "./actions";

export default function CreateClubPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    
    try {
      const res = await createClubAction(formData);
      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      <Link href="/clubs" className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-8 inline-block">
        ← Back to Clubs
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          Start a New Club
        </h1>
        <p className="text-[#a0a0a8]">
          Gather your friends, compete on the leaderboard, and climb the ranks.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 md:p-8 shadow-elevated"
      >
        {error && (
          <div className="mb-6 p-4 bg-[#ca3431]/10 border border-[#ca3431]/30 text-[#ca3431] rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-white mb-2">Club Name</label>
            <input 
              id="name"
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Endgame Grinders"
              className="w-full bg-[#0a0a0b] border border-[#2a2a30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#81b64c] transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="desc" className="block text-sm font-bold text-white mb-2">Description</label>
            <textarea 
              id="desc"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your club about?"
              className="w-full bg-[#0a0a0b] border border-[#2a2a30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#81b64c] transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !name || !description}
            className="w-full py-4 bg-[#81b64c] hover:bg-[#9fcc6b] disabled:opacity-50 disabled:hover:bg-[#81b64c] text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(129,182,76,0.2)]"
          >
            {isSubmitting ? "Creating..." : "Create Club"}
          </button>
        </form>
      </motion.div>
      
      <div className="mt-8">
        <AdSlot format="horizontal" />
      </div>
    </div>
  );
}
