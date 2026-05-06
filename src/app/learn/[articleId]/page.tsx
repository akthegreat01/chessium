import { ARTICLES } from '@/lib/articles';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ArticleBoard from '@/components/ArticleBoard';

export async function generateMetadata({ params }: { params: Promise<{ articleId: string }> }): Promise<Metadata> {
  const { articleId } = await params;
  const article = ARTICLES.find(a => a.id === articleId);
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: `${article.title} — Underpromotion Learn`,
    description: article.preview,
  };
}

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    articleId: article.id,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = await params;
  const article = ARTICLES.find(a => a.id === articleId);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#d4af37] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Article Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}>
              {article.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />{article.readTime}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed font-medium">
            {article.preview}
          </p>
        </div>

        {/* Article Body */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl mb-12">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#d4af37] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-300">
            {/* Split content by lines to render markdown-like structures manually for now */}
            {article.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('[BOARD|')) {
                // Format: [BOARD|fen|orientation|caption|solution]
                const parts = paragraph.replace('[BOARD|', '').replace(']', '').split('|');
                const [fen, orientation, caption, solution] = parts;
                return (
                  <ArticleBoard 
                    key={index} 
                    fen={fen} 
                    orientation={orientation as 'white' | 'black'} 
                    caption={caption || undefined}
                    solution={solution || undefined}
                  />
                );
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-2xl mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                return <p key={index} className="italic text-gray-400 border-l-2 border-[#d4af37]/30 pl-4">{paragraph.replace(/\*/g, '')}</p>;
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 mt-4 mb-4">
                    {lines.map((line, i) => {
                      const match = line.match(/^\d+\.\s+\*\*(.*?)\*\*(.*)/);
                      if (match) {
                        return <li key={i}><strong className="text-white">{match[1]}</strong>{match[2]}</li>;
                      }
                      return <li key={i}>{line}</li>;
                    })}
                  </ul>
                );
              }
              return <p key={index} className="mb-6">{paragraph}</p>;
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-2xl font-black text-white mb-3 relative z-10">Put theory into practice</h3>
          <p className="text-gray-400 text-sm mb-6 relative z-10 max-w-md mx-auto">
            Analyze your games with our grandmaster-level engine to find the brilliant moves you missed.
          </p>
          <Link href="/analysis" className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-[0.15em] font-black inline-flex items-center gap-2 relative z-10">
            Start Analyzing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
