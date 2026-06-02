"use client";

import { MoveClassification } from "@/types/chess";

interface MoveIconProps {
  classification?: MoveClassification;
  className?: string;
}

export default function MoveIcon({ classification, className = "" }: MoveIconProps) {
  if (!classification) return null;

  const getDetails = () => {
    switch (classification) {
      case "brilliant":
        return { color: "bg-[#1baca6]", icon: "!!", title: "Brilliant" };
      case "great":
        return { color: "bg-[#5c8bb0]", icon: "!", title: "Great Find" };
      case "best":
        return { color: "bg-[#81b64c]", icon: "★", title: "Best Move" };
      case "excellent":
        return { color: "bg-[#96bc4b]", icon: "✓", title: "Excellent" };
      case "good":
        return { color: "bg-[#96bc4b]", icon: "", title: "Good" };
      case "inaccuracy":
        return { color: "bg-[#f7c631]", icon: "?!", title: "Inaccuracy" };
      case "mistake":
        return { color: "bg-[#e58f2a]", icon: "?", title: "Mistake" };
      case "blunder":
        return { color: "bg-[#ca3431]", icon: "??", title: "Blunder" };
      case "missed_win":
        return { color: "bg-[#991b1b]", icon: "✖", title: "Missed Win" };
      default:
        return null;
    }
  };

  const details = getDetails();
  if (!details || !details.icon) return null;

  return (
    <div
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white shadow-sm ${details.color} ${className}`}
      title={details.title}
    >
      {details.icon}
    </div>
  );
}
