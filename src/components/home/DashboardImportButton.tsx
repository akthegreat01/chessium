"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ImportModal from "@/components/chess/ImportModal";

export default function DashboardImportButton() {
  const router = useRouter();

  const handleImport = (type: 'pgn' | 'fen', data: string) => {
    sessionStorage.setItem('chessium_import_type', type);
    sessionStorage.setItem('chessium_import_data', data);
    router.push(`/analyze`);
  };

  return (
    <ImportModal onImport={handleImport}>
      <Button variant="outline" className="w-full h-11 rounded-xl border-border bg-surface hover:bg-white/[0.06] text-foreground font-semibold text-[13px] gap-2 transition-all">
        <Upload className="w-4 h-4" />
        Import Game
      </Button>
    </ImportModal>
  );
}
