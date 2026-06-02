import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "How to use Stockfish to Improve Your Game",
      excerpt: "Learn how to effectively analyze your games using the engine without falling into common traps.",
      date: "June 2, 2026",
      category: "Improvement",
    },
    {
      title: "Mastering the Caro-Kann Defense",
      excerpt: "A deep dive into one of the most solid responses to 1.e4. Learn the key ideas and variations.",
      date: "May 28, 2026",
      category: "Openings",
    },
    {
      title: "Chessium Platform Updates - June 2026",
      excerpt: "We've added 3D board pieces, a new sleek dark mode, and faster engine evaluation.",
      date: "May 15, 2026",
      category: "Updates",
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Chessium Blog</h1>
          <p className="text-[#a0a0a8] text-lg">Insights, tutorials, and updates from the Chessium team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={i} className="group relative bg-[#0d0d0e] border border-[#2a2a30] rounded-2xl p-6 hover:bg-[#141416] transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#81b64c]/20 text-[#81b64c]">
                  {post.category}
                </span>
                <span className="text-xs text-[#6b6b75]">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#81b64c] transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-[#a0a0a8] text-sm leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm font-medium text-white group-hover:text-[#81b64c]">
                  Read Article
                  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
              {/* Full click target */}
              <Link href="#" className="absolute inset-0 z-10">
                <span className="sr-only">Read {post.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
