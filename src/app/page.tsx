import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import SocialProof from "@/components/landing/SocialProof";
import BlogPreview from "@/components/landing/BlogPreview";
import CTA from "@/components/landing/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
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
