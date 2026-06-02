"use client";

import { motion } from "motion/react";

const blogPosts = [
  {
    slug: "mastering-ruy-lopez",
    title: "Mastering the Ruy Lopez: A Complete Guide",
    excerpt:
      "Learn the key ideas, variations, and strategic concepts behind one of the oldest and most respected chess openings.",
    category: "Openings",
    readTime: "8 min read",
    date: "Dec 15, 2025",
    image: "♗",
  },
  {
    slug: "tactical-patterns-beginners",
    title: "10 Essential Tactical Patterns Every Beginner Should Know",
    excerpt:
      "From forks to pins, skewers to discovered attacks — master these patterns to win more games immediately.",
    category: "Tactics",
    readTime: "6 min read",
    date: "Dec 10, 2025",
    image: "♞",
  },
  {
    slug: "endgame-fundamentals",
    title: "Endgame Fundamentals: King and Pawn vs King",
    excerpt:
      "Understanding basic endgames is crucial for converting advantages. Learn the opposition, the square rule, and more.",
    category: "Endgames",
    readTime: "5 min read",
    date: "Dec 5, 2025",
    image: "♔",
  },
];

const categoryColors: Record<string, string> = {
  Openings: "#81b64c",
  Tactics: "#f7c631",
  Endgames: "#5c8bb0",
  "Chess News": "#e58f2a",
  Improvement: "#1baca6",
};

export default function BlogPreview() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Latest from the{" "}
              <span className="text-[#81b64c]">blog</span>
            </h2>
            <p className="text-[#6b6b75]">
              Chess insights, strategies, and improvement guides
            </p>
          </div>
          <a
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#81b64c] hover:text-[#9fcc6b] transition-colors"
          >
            View all articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group block"
            >
              <div className="h-full rounded-2xl border border-[#2a2a30] bg-[#141416] hover:bg-[#1a1a1f] hover:border-[#3a3a42] transition-all duration-300 overflow-hidden">
                {/* Image placeholder */}
                <div
                  className="h-44 flex items-center justify-center text-6xl opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${
                      categoryColors[post.category] || "#81b64c"
                    }08 0%, transparent 100%)`,
                  }}
                >
                  {post.image}
                </div>

                <div className="p-5">
                  {/* Category + Read time */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${
                          categoryColors[post.category] || "#81b64c"
                        }15`,
                        color: categoryColors[post.category] || "#81b64c",
                      }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-[#4a4a55]">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#81b64c] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-[#6b6b75] line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  {/* Date */}
                  <div className="text-xs text-[#4a4a55]">{post.date}</div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <a
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[#81b64c] hover:text-[#9fcc6b] transition-colors"
          >
            View all articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
