import React from "react";
import { User, Code2, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About Chessium
          </h1>
          <p className="text-lg text-secondary-foreground">
            Built by players, for players.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 mb-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Our Story</h2>
          </div>
          <div className="space-y-4 text-secondary-foreground leading-relaxed">
            <p>
              Chessium started as a simple idea: what if chess analysis didn't have to look like a spreadsheet? We wanted to build a platform that felt as premium and dynamic as the game itself.
            </p>
            <p>
              By combining beautiful design with powerful AI engines, we've created a modern environment where ambitious players can analyze their games, track their progress, and improve their skills through adaptive puzzles and detailed feedback.
            </p>
          </div>
        </div>

        {/* Developers Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Akshath Kataria */}
          <div className="bg-surface border border-border rounded-2xl p-8 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Akshath Kataria</h3>
                <p className="text-sm text-secondary-foreground font-medium uppercase tracking-wider">Lead Developer</p>
              </div>
            </div>
            <p className="text-secondary-foreground leading-relaxed text-sm">
              The visionary behind Chessium's core architecture and AI integrations. Akshath brought the sophisticated game logic and seamless analysis engine to life, ensuring that every move is evaluated with precision.
            </p>
          </div>

          {/* Nikunj Bhardwaj */}
          <div className="bg-surface border border-border rounded-2xl p-8 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nikunj Bhardwaj</h3>
                <p className="text-sm text-secondary-foreground font-medium uppercase tracking-wider">Co-Developer</p>
              </div>
            </div>
            <p className="text-secondary-foreground leading-relaxed text-sm">
              Focusing on user experience and the platform's robust feature set, Nikunj helped sculpt Chessium into a cohesive product that players actually love to use, from interactive learning tracks to dynamic puzzles.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
