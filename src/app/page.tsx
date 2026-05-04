"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LandingPage = dynamic(() => import("@/components/LandingPage"), { ssr: false });

export default function Home() {
  const router = useRouter();

  const handleLandingStart = (mode: 'ai' | 'review' | 'editor') => {
    router.push(`/analysis?mode=${mode}`);
  };

  return <LandingPage onStart={handleLandingStart} />;
}
