import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "future-of-ai-chess",
    title: "The Future of AI in Chess Training",
    excerpt: "How modern neural networks are changing the way Grandmasters and amateurs alike prepare for tournaments.",
    date: "May 28, 2026",
    readTime: "5 min read"
  },
  {
    slug: "mastering-sicilian",
    title: "Mastering the Sicilian Defense",
    excerpt: "A deep dive into the most aggressive response to 1.e4 and how to navigate the complex middlegames.",
    date: "May 20, 2026",
    readTime: "8 min read"
  },
  {
    slug: "engine-evaluation-explained",
    title: "Understanding Engine Evaluations",
    excerpt: "What does +1.5 actually mean? We break down how Stockfish evaluates positions and how to interpret it.",
    date: "May 15, 2026",
    readTime: "4 min read"
  },
  {
    slug: "carlsen-legacy",
    title: "Magnus Carlsen: A Legacy of Endgames",
    excerpt: "Analyzing the World Champion's unparalleled ability to squeeze water from a stone in seemingly drawn endgames.",
    date: "May 10, 2026",
    readTime: "6 min read"
  },
  {
    slug: "blitz-chess-strategies",
    title: "Speed and Precision: Blitz Chess Strategies",
    excerpt: "How to manage your time, avoid flags, and play practical chess when the clock is ticking down.",
    date: "May 3, 2026",
    readTime: "4 min read"
  }
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight mb-4">The Chessium Blog</h1>
        <p className="text-xl text-secondary-foreground mb-16">Insights, updates, and deep dives into the world of chess.</p>

        <div className="flex flex-col gap-8">
          {BLOG_POSTS.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
              <article className="bg-surface border border-border p-8 rounded-2xl transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                <div className="flex items-center gap-3 text-[13px] text-secondary-foreground mb-3">
                  <time>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-secondary-foreground text-lg mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center text-sm font-medium text-primary">
                  Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
