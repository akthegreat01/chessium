import React from "react";
import { MoveClassification } from "@/lib/analyzer/classification";
import { Star, ThumbsUp, Check, BookOpen, X } from "lucide-react";

interface ClassificationIconProps {
  classification: MoveClassification;
  className?: string;
}

export default function ClassificationIcon({ classification, className = "" }: ClassificationIconProps) {
  const baseClasses = `inline-flex items-center justify-center rounded-full text-white font-bold shrink-0 ${className}`;

  switch (classification) {
    case "Brilliant":
      return (
        <div className={`${baseClasses} bg-[#1cb0f6]`} title="Brilliant">
          !!
        </div>
      );
    case "Great Move":
      return (
        <div className={`${baseClasses} bg-[#5f8baf]`} title="Great Move">
          !
        </div>
      );
    case "Best Move":
      return (
        <div className={`${baseClasses} bg-[#81b64c]`} title="Best Move">
          <Star className="w-[60%] h-[60%] fill-current" />
        </div>
      );
    case "Excellent":
      return (
        <div className={`${baseClasses} bg-[#96bc4b]`} title="Excellent">
          <ThumbsUp className="w-[55%] h-[55%] fill-current" />
        </div>
      );
    case "Good":
      return (
        <div className={`${baseClasses} bg-[#96af8b]`} title="Good">
          <Check className="w-[70%] h-[70%]" strokeWidth={4} />
        </div>
      );
    case "Book":
      return (
        <div className={`${baseClasses} bg-[#a88865]`} title="Book">
          <BookOpen className="w-[60%] h-[60%] fill-current" />
        </div>
      );
    case "Inaccuracy":
      return (
        <div className={`${baseClasses} bg-[#f0c15c]`} title="Inaccuracy">
          ?!
        </div>
      );
    case "Mistake":
      return (
        <div className={`${baseClasses} bg-[#f68a1e]`} title="Mistake">
          ?
        </div>
      );
    case "Miss":
      return (
        <div className={`${baseClasses} bg-[#e56353]`} title="Miss">
          <X className="w-[70%] h-[70%]" strokeWidth={4} />
        </div>
      );
    case "Blunder":
      return (
        <div className={`${baseClasses} bg-[#ca3431]`} title="Blunder">
          ??
        </div>
      );
    default:
      return null;
  }
}
