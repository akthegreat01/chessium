import { BLOG_POSTS } from "../data";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 max-w-3xl mx-auto w-full">
        <Link href="/blog" className="inline-flex items-center text-[#a0a0a8] hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        
        <article>
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#81b64c]/20 text-[#81b64c]">
                {post.category}
              </span>
              <span className="text-sm text-[#6b6b75]">{post.date}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-[#a0a0a8] leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#81b64c] hover:prose-a:text-[#9fcc6b] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
