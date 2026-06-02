"use client";

import { motion } from "motion/react";

export default function CTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#81b64c] opacity-[0.03] blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Chess piece decoration */}
          <div className="text-6xl mb-6 opacity-20">♚</div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ready to improve your{" "}
            <span className="text-[#81b64c]">chess</span>?
          </h2>
          <p className="text-[#a0a0a8] text-lg mb-10 max-w-xl mx-auto">
            Join Chessium today. No credit card required. Start analyzing games,
            solving puzzles, and improving your rating — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(129,182,76,0.3)] min-w-[200px]"
            >
              <span className="flex items-center gap-2">
                Create Free Account
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </a>
            <a
              href="/analysis"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[#a0a0a8] hover:text-white transition-colors"
            >
              Or analyze a game →
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex items-center justify-center gap-6 text-[#4a4a55] text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Free forever
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Stockfish 18
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
              </svg>
              No sign-up needed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
