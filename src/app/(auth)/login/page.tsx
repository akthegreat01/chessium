"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Logo mark */}
      <div className="w-10 h-10 flex items-center justify-center mb-8 opacity-80">
        <img src="/chessium_logo.png" alt="Chessium" className="w-full h-full object-contain" />
      </div>

      {/* Header */}
      <h1 className="text-[28px] font-semibold tracking-tight text-foreground mb-1.5 text-center">
        Sign in to Chessium
      </h1>
      <p className="text-[15px] text-secondary-foreground text-center mb-8">
        Welcome back. Enter your credentials to continue.
      </p>

      {/* Form card */}
      <div className="w-full bg-surface/80 border border-border rounded-2xl p-6 backdrop-blur-sm">
        <form onSubmit={onSubmit} className="space-y-4">
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-[13px] font-medium text-secondary-foreground">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="w-full flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[12px] text-secondary-foreground/50 uppercase tracking-widest font-medium">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* OAuth placeholder */}
      <button
        type="button"
        disabled
        className="w-full h-11 bg-surface/80 border border-border rounded-2xl text-[14px] font-medium text-secondary-foreground hover:text-foreground hover:bg-surface transition-all duration-200 flex items-center justify-center gap-2.5 cursor-not-allowed opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* Footer link */}
      <p className="mt-8 text-[13px] text-secondary-foreground text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:underline underline-offset-2 transition-all duration-200">
          Create one
        </Link>
      </p>
    </div>
  );
}
