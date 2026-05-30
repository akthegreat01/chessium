"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 w-full px-8 pt-8">
        <Link href="/home" className="inline-flex items-center gap-2.5 group">
          <div className="w-5 h-5 flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <img src="/logo.png" alt="Chessium" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="text-[14px] font-medium text-secondary-foreground group-hover:text-foreground transition-colors duration-300">Chessium</span>
        </Link>
      </header>

      {/* Centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          {/* Logo mark */}
          <div className="w-10 h-10 flex items-center justify-center mb-8 opacity-80">
            <img src="/logo.png" alt="Chessium" className="w-full h-full object-contain filter invert" />
          </div>

          {/* Header */}
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground mb-1.5 text-center">
            Set a new password
          </h1>
          <p className="text-[15px] text-secondary-foreground text-center mb-8 max-w-[320px] leading-relaxed">
            Choose a strong password for your Chessium account.
          </p>

          {/* Form card */}
          <div className="w-full bg-surface/80 border border-border rounded-2xl p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-secondary-foreground mb-2">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-[15px] text-foreground placeholder:text-secondary-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-200"
                />
              </div>

              {error && (
                <div className="px-3.5 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-[13px] text-destructive font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-foreground text-background rounded-lg text-[14px] font-semibold hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom links */}
      <footer className="relative z-10 w-full px-8 pb-8 flex justify-center">
        <div className="flex items-center gap-6 text-[12px] text-secondary-foreground/50">
          <span>© 2025 Chessium</span>
        </div>
      </footer>
    </div>
  );
}
