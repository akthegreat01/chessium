import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdSenseBanner } from "@/components/ui/AdSenseBanner";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Mock content for demonstration
  const title = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-secondary-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
        <div className="mb-10">
          <div className="flex items-center gap-3 text-[13px] text-secondary-foreground mb-4">
            <time>May 28, 2026</time>
            <span>•</span>
            <span>5 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">{title}</h1>
        </div>
        
        <div className="prose prose-invert prose-p:text-secondary-foreground prose-headings:text-foreground prose-a:text-primary prose-lg max-w-none">
          <p>
            Welcome to this deeply insightful article about {title}. In the modern era of chess, preparation is everything. 
            Whether you are analyzing deep opening lines with Stockfish or preparing psychological traps for your opponent, 
            having the right tools can make all the difference.
          </p>
          <h2>The Role of Preparation</h2>
          <p>
            Grandmasters spend hours every day memorizing lines and understanding the nuances of different structures. 
            But with platforms like Chessium, the barrier to entry is lower than ever. You can now get AI-driven insights 
            that previously required a team of seconds to discover.
          </p>

          <div className="my-10 not-prose">
            <AdSenseBanner />
          </div>

          <blockquote>
            "Chess is 99% tactics, but to get to those tactics, you need 100% preparation."
          </blockquote>
          <p>
            As you continue your journey, remember that consistency is key. Keep solving puzzles, analyzing your mistakes, 
            and studying the theoretical concepts that define the game.
          </p>
        </div>
      </div>
    </div>
  );
}
