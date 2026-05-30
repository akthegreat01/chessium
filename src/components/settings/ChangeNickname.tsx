"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangeNickname({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!name.trim() || name === currentName) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { display_name: name }
      });
      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex-1 mr-4">
        <div className="text-[14px] font-medium mb-1">Display Name</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your nickname"
          className="w-full max-w-[250px] bg-background border border-border rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      <Button 
        onClick={handleUpdate} 
        disabled={loading || name === currentName || !name.trim()}
        variant="outline" 
        className="h-8 rounded text-[12px] border-border hover:bg-white/5 min-w-[70px]"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Update"}
      </Button>
    </div>
  );
}
