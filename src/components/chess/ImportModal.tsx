"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileDown } from "lucide-react";

interface ImportModalProps {
  onImport: (type: 'pgn' | 'fen', data: string) => void;
  children: React.ReactNode;
}

export default function ImportModal({ onImport, children }: ImportModalProps) {
  const [open, setOpen] = useState(false);
  const [inputData, setInputData] = useState("");

  const handleImport = () => {
    if (!inputData.trim()) return;
    
    // Simple heuristic: FENs have multiple slashes, PGNs usually start with tags or 1.
    const isFen = inputData.split('/').length > 4;
    onImport(isFen ? 'fen' : 'pgn', inputData.trim());
    setOpen(false);
    setInputData("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputData(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-surface border border-white/10 rounded-[32px] p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Import Game</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <Textarea 
            placeholder="Paste PGN or FEN here..." 
            className="min-h-[200px] bg-background border-white/10 resize-none rounded-2xl font-mono text-sm"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input 
                type="file" 
                accept=".pgn,.txt" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full border-white/10 bg-white/5 rounded-xl gap-2">
                <FileDown className="w-4 h-4" /> Load .PGN File
              </Button>
            </div>
            
            <Button className="flex-1 rounded-xl gap-2 font-bold" onClick={handleImport}>
              <Upload className="w-4 h-4" /> Load Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
