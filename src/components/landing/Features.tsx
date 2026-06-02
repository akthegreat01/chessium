"use client";

import { motion } from "motion/react";
import { useRef } from "react";

const features = [
  {
    title: "Game Analysis",
    description:
      "Get engine-powered analysis with accuracy scores, move classifications, and improvement suggestions.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    color: "#81b64c",
    features: ["Accuracy score", "Move classifications", "Eval graph", "Engine lines"],
  },
  {
    title: "Puzzles",
    description:
      "Sharpen your tactical skills with daily puzzles, themed challenges, and timed puzzle rush mode.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.421 48.421 0 01-4.185-.428 1.289 1.289 0 01-1.103-1.262v-.847c0-.413.202-.808.52-1.066a6.009 6.009 0 014.024-1.528C11.95 1.625 13.6 2.3 14.732 3.355c.52.258.768.653.768 1.066v.847a1.289 1.289 0 01-1.103 1.262" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v6.75m-3-3h6" />
      </svg>
    ),
    color: "#f7c631",
    features: ["Daily puzzles", "Puzzle rush", "Themed challenges", "Rating tracking"],
  },
  {
    title: "Courses",
    description:
      "Structured chess education from beginner to advanced with interactive lessons and progress tracking.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    color: "#5c8bb0",
    features: ["Beginner to Advanced", "Interactive boards", "Quizzes", "Progress tracking"],
  },
  {
    title: "Play vs Bots",
    description:
      "Challenge AI opponents at any level from 300 to 2600 with unique personalities and playing styles.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    color: "#e58f2a",
    features: ["7 difficulty levels", "Bot personalities", "Drag & drop", "Game review"],
  },
  {
    title: "Statistics",
    description:
      "Track your chess journey with detailed analytics, rating trends, and performance insights.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: "#1baca6",
    features: ["Rating graphs", "Accuracy trends", "Opening stats", "Win/loss ratios"],
  },
  {
    title: "Import Games",
    description:
      "Import your games from Chess.com and Lichess with one click. Paste PGN or upload files.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    color: "#9370db",
    features: ["Chess.com import", "Lichess import", "PGN upload", "Bulk analysis"],
  },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111113] to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-[#81b64c]">master chess</span>
          </h2>
          <p className="text-[#a0a0a8] text-lg max-w-2xl mx-auto">
            Powerful tools built on Stockfish 18, the strongest chess engine in
            the world. All running in your browser — no sign-up required.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative h-full p-6 rounded-2xl border border-[#2a2a30] bg-[#141416] hover:bg-[#1a1a1f] hover:border-[#3a3a42] transition-all duration-300">
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `inset 0 0 30px ${feature.color}08, 0 0 20px ${feature.color}08`,
                  }}
                />

                {/* Icon */}
                <div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="relative text-[#a0a0a8] text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Feature list */}
                <div className="relative flex flex-wrap gap-2">
                  {feature.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full border border-[#2a2a30] text-[#6b6b75] group-hover:text-[#a0a0a8] group-hover:border-[#3a3a42] transition-colors"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
