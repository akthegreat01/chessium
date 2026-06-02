import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import SocialProof from "@/components/landing/SocialProof";
import BlogPreview from "@/components/landing/BlogPreview";
import CTA from "@/components/landing/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Chessium",
    "url": "https://chessium.in/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://chessium.in/analysis?pgn={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "The modern chess platform for analysis, puzzles, courses, and improvement."
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Script
        id="schema-org-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <SocialProof />
        <BlogPreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
