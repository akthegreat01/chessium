"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="absolute top-8 left-8 z-10">
        <Link href="/home" className="inline-flex items-center text-secondary-foreground hover:text-foreground font-medium transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md bg-surface border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Update Password</h1>
            <p className="text-secondary-foreground">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
