"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-secondary-foreground">Sign in to your Chessium account</p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="you@example.com" 
            required 
            className="h-12 rounded-xl bg-background border-white/10"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            className="h-12 rounded-xl bg-background border-white/10"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-secondary-foreground text-sm font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline font-semibold">
          Sign up
        </Link>
      </div>
    </div>
  );
}
