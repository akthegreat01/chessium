"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center">
        {/* Success state */}
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-7 h-7 text-success" />
        </div>

        <h1 className="text-[28px] font-semibold tracking-tight text-foreground mb-1.5 text-center">
          Check your email
        </h1>
        <p className="text-[15px] text-secondary-foreground text-center mb-8 max-w-[320px] leading-relaxed">
          We&apos;ve sent a password reset link to your email address. It may take a minute to arrive.
        </p>

        <Link href="/login" className="w-full max-w-[400px]">
          <button className="w-full h-11 bg-surface border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-white/[0.04] transition-all duration-200">
            Back to Sign In
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Logo mark */}
      <div className="w-10 h-10 flex items-center justify-center mb-8 opacity-80">
        <img src="/chessium_logo.png" alt="Chessium" className="w-full h-full object-contain" />
      </div>

      {/* Header */}
      <h1 className="text-[28px] font-semibold tracking-tight text-foreground mb-1.5 text-center">
        Reset your password
      </h1>
      <p className="text-[15px] text-secondary-foreground text-center mb-8 max-w-[320px] leading-relaxed">
        Enter the email associated with your account and we&apos;ll send a reset link.
      </p>

      {/* Form card */}
      <div className="w-full bg-surface/80 border border-border rounded-2xl p-6 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-secondary-foreground mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="mt-8 text-[13px] text-secondary-foreground text-center">
        Remember your password?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-2 transition-all duration-200">
          Sign in
        </Link>
      </p>
    </div>
  );
}
