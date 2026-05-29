"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    // Assuming we have an update-password route
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
      <div className="bg-surface border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-black/20 backdrop-blur-xl text-center">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-4">Check your email</h1>
        <p className="text-secondary-foreground mb-8">
          We&apos;ve sent you a password reset link. Please check your inbox.
        </p>
        <Link href="/login">
          <Button className="w-full h-12 rounded-xl text-base font-semibold" variant="outline">
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Reset Password</h1>
        <p className="text-secondary-foreground">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-8 text-center text-secondary-foreground text-sm font-medium">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}
