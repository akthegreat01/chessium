"use client";

import React from 'react';
import BoardEditor from '@/components/BoardEditor';
import { useRouter } from 'next/navigation';

export default function EditorPage() {
  const router = useRouter();

  return (
    <BoardEditor 
      onClose={() => router.push('/')} 
      onAnalyze={(fen) => router.push(`/analysis?fen=${encodeURIComponent(fen)}`)} 
    />
  );
}
