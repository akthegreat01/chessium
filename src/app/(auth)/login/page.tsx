"use client";

import { useActionState, useEffect } from "react";
import { login } from "../actions";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-[#111113] border border-[#2a2a30] rounded-2xl p-8 shadow-elevated">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-[#a0a0a8] text-sm">Log in to your Chessium account</p>
        </div>

        <form action={formAction} className="space-y-4">
          {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
          
          <div>
            <label className="block text-sm font-medium text-[#a0a0a8] mb-1.5 ml-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded-xl px-4 py-3 text-white placeholder-[#4a4a55] focus:outline-none focus:border-[#81b64c] focus:ring-1 focus:ring-[#81b64c] transition-all"
              placeholder="magnus_c"
              autoComplete="username"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label className="block text-sm font-medium text-[#a0a0a8]">
                Password
              </label>
            </div>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded-xl px-4 py-3 text-white placeholder-[#4a4a55] focus:outline-none focus:border-[#81b64c] focus:ring-1 focus:ring-[#81b64c] transition-all"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {state?.error && (
            <div className="p-3 rounded-lg bg-[#ca3431]/10 border border-[#ca3431]/20 text-[#ca3431] text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#81b64c] hover:bg-[#9fcc6b] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg hover:shadow-[0_0_20px_rgba(129,182,76,0.2)]"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#a0a0a8]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#81b64c] hover:text-[#9fcc6b] font-medium transition-colors">
            Sign up for free
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
