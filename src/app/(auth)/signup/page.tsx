"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
        <p className="text-secondary-foreground">Start analyzing and improving today</p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username" 
            type="text" 
            placeholder="chessmaster99" 
            required 
            minLength={3}
            maxLength={20}
            className="h-12 rounded-xl bg-background border-white/10"
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            minLength={6}
            className="h-12 rounded-xl bg-background border-white/10"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
        </Button>
      </form>

      <div className="mt-8 text-center text-secondary-foreground text-sm font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}
