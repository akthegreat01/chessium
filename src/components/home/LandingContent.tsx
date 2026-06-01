"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroBoard from "@/components/home/HeroBoard";
import ChessComConnect from "@/components/home/ChessComConnect";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import React, { useRef, useEffect } from "react";
import {
  Brain,
  Target,
  LineChart,
  Check,
  Star,
  BookOpen,
  Crosshair,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Understand every game. Identify mistakes, blunders, and missed opportunities with AI-powered review.",
  },
  {
    icon: Target,
    title: "Personalized Training",
    description:
      "Adaptive puzzles and lessons tailored to your weaknesses. Train smarter, improve faster.",
  },
  {
    icon: LineChart,
    title: "Performance Insights",
    description:
      "Track rating growth, accuracy trends, and opening performance over time.",
  },
];

const capabilities = [
  {
    icon: Brain,
    title: "AI Game Review",
    description:
      "Get move-by-move analysis powered by advanced chess engines and AI commentary.",
  },
  {
    icon: Crosshair,
    title: "Move Classification",
    description:
      "Every move is classified — brilliant, great, book, inaccuracy, mistake, or blunder.",
  },
  {
    icon: TrendingUp,
    title: "Accuracy Tracking",
    description:
      "Monitor your accuracy percentage across games, openings, and time controls.",
  },
  {
    icon: BookOpen,
    title: "Opening Explorer",
    description:
      "Explore opening theory, compare your choices with master-level databases.",
  },
  {
    icon: Star,
    title: "Improvement Recommendations",
    description:
      "Receive personalized tips and focus areas based on your game patterns.",
  },
];

const testimonials = [
  {
    quote:
      "Chessium completely changed how I approach post-game analysis. The AI insights are sharper than anything I've used before — I gained 200 rating points in three months.",
    name: "Marcus Chen",
    title: "FIDE-rated player, 2150 ELO",
  },
  {
    quote:
      "The adaptive training puzzles are brilliant. They always target exactly the positions where I struggle. It feels like having a personal coach available 24/7.",
    name: "Elena Kovac",
    title: "National Women's Champion, Croatia",
  },
  {
    quote:
      "I've tried every chess platform out there. Chessium is the first one that actually feels like a premium product — clean, fast, and genuinely useful.",
    name: "James Whitfield",
    title: "Chess coach & content creator",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: [
      "5 game analyses per month",
      "Daily puzzles",
      "Standard board themes",
      "Basic statistics",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    features: [
      "Unlimited AI analysis",
      "Adaptive training",
      "Premium board themes",
      "Performance insights",
      "Opening explorer",
    ],
    highlighted: true,
    cta: "Start Pro Trial",
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    features: [
      "Everything in Pro",
      "Coach dashboard",
      "Student tracking",
      "Priority support",
      "Custom branding",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Changelog", href: "#" }
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "#" }
  ],
  Legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "Security", href: "/security" }
  ],
};

const fakeMoves = [
  { number: 1, white: "e4", black: "e5" },
  { number: 2, white: "Nf3", black: "Nc6" },
  { number: 3, white: "Bb5", black: "a6" },
  { number: 4, white: "Ba4", black: "Nf6" },
];

export default function LandingContent({ user }: { user: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);
  
  // 3D Mouse Tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // Smooth out the raw mouse values
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

  // Transforms for Text (Background)
  const textRotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const textRotateY = useTransform(smoothX, [0, 1], [-15, 15]);
  const textX = useTransform(smoothX, [0, 1], [-20, 20]);
  const textY = useTransform(smoothY, [0, 1], [-20, 20]);

  // Transforms for Logo (Foreground)
  const logoRotateX = useTransform(smoothY, [0, 1], [25, -25]);
  const logoRotateY = useTransform(smoothX, [0, 1], [-25, 25]);
  const logoX = useTransform(smoothX, [0, 1], [-40, 40]);
  const logoY = useTransform(smoothY, [0, 1], [-40, 40]);
  const logoZ = useTransform(smoothX, [0, 1], [30, 80]); // Pop out

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <section 
        className="relative pt-48 md:pt-56 pb-32 md:pb-40"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0.5);
          mouseY.set(0.5);
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col items-center">
            {/* Logo Visual Presentation (Moved to top) */}
            <motion.div
              className="relative mt-8 md:mt-12 mb-16 md:mb-24 flex items-center justify-center w-full max-w-5xl mx-auto"
              style={{ perspective: "1200px" }}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {/* Massive Background Text */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
                style={{ 
                  rotateX: textRotateX, 
                  rotateY: textRotateY, 
                  x: textX, 
                  y: textY,
                  z: -100 
                }}
              >
                <span className="text-[15vw] md:text-[220px] font-black tracking-tighter leading-none whitespace-nowrap bg-gradient-to-b from-[#E2E2E2] via-[#BDBDBD] to-[#8F8F8F] bg-clip-text text-transparent drop-shadow-2xl opacity-60">
                  CHESSIUM
                </span>
              </motion.div>

              {/* Glowing Aura */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
              </div>

              {/* Logo Image */}
              <motion.div 
                className="relative z-10 w-[280px] h-[280px] md:w-[480px] md:h-[480px] drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]"
                style={{ 
                  rotateX: logoRotateX, 
                  rotateY: logoRotateY, 
                  x: logoX, 
                  y: logoY,
                  z: logoZ,
                  transformStyle: "preserve-3d" 
                }}
              >
                <Image 
                  src="/chessium_logo.png" 
                  alt="Chessium Logo"
                  width={480}
                  height={480}
                  priority
                  className="w-full h-full object-contain drop-shadow-2xl" 
                />
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-6xl md:text-[80px] font-bold tracking-tight leading-[1.05]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                Master Every Move.
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4,
                }}
              >
                AI-powered chess analysis, personalized training, and beautiful
                gameplay designed for ambitious players.
              </motion.p>

              <motion.div
                className="mt-10 flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.5,
                }}
              >
                <Link href={user ? "/home" : "/signup"}>
                  <Button className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-[15px] font-medium rounded-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Chess.com Sync Section ─── */}
      <ChessComConnect />

      {/* ─── Trust / Social Proof Section ─── */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x md:divide-border">
            {[
              { value: "50,000+", label: "Games Analyzed" },
              { value: "12,000+", label: "Active Players" },
              { value: "500,000+", label: "Moves Analyzed" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                <p className="text-5xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-3 text-[13px] uppercase tracking-widest font-medium text-secondary-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-32 md:py-40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div className="text-center mb-16 md:mb-20" {...sectionAnim}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Built for serious players.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-surface/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-[24px] p-10 transition-all duration-300 hover:border-white/20 hover:bg-surface/60 hover:shadow-[0_0_60px_rgba(212,175,55,0.08)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                <feature.icon className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-xl font-bold tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-secondary-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Product Showcase Section ─── */}
      <section className="py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div className="mb-16 md:mb-20" {...sectionAnim}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need to improve.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {capabilities.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-5 py-8 border-b border-border px-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.06,
                }}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-[15px] leading-relaxed text-secondary-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div className="text-center mb-16 md:mb-20" {...sectionAnim}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Loved by players worldwide.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-surface border border-border rounded-xl p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-[15px] leading-relaxed text-secondary-foreground italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-secondary-foreground mt-0.5">
                    {t.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section id="pricing" className="py-32 md:py-40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div className="text-center mb-16 md:mb-20" {...sectionAnim}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="mt-4 text-lg text-secondary-foreground font-medium">
              Memberships coming soon.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center justify-center p-16 md:p-24 bg-surface border border-border rounded-2xl max-w-3xl mx-auto text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)] pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Coming Soon
            </h3>
            <p className="text-secondary-foreground">
              We are working hard to bring you premium tiers with incredible features.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA Section ─── */}
      <section className="relative py-40">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-primary/5 blur-[150px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center">
          <motion.div {...sectionAnim}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to master every move?
            </h2>
            <p className="text-lg md:text-xl text-secondary-foreground max-w-xl mx-auto mb-10">
              Join thousands of players improving faster with Chessium.
            </p>
            <Link href={user ? "/home" : "/signup"}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-10 text-[15px] font-medium rounded-lg">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Ad Space ─── */}
      <section className="relative py-10 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="w-full bg-surface/50 border border-border p-6 rounded-[32px] flex flex-col items-center justify-center min-h-[250px] shadow-lg relative overflow-hidden">
            <span className="text-[10px] font-bold text-secondary-foreground absolute top-4 left-4 uppercase tracking-widest z-10">Advertisement</span>
            {/* AdSense Unit */}
            <ins className="adsbygoogle"
                 style={{ display: "block", width: "100%", minHeight: "200px" }}
                 data-ad-client="ca-pub-9046932302377091"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">
                    C
                  </span>
                </div>
                <span className="text-[17px] font-bold tracking-tight">
                  Chessium
                </span>
              </div>
              <p className="text-[14px] text-secondary-foreground leading-relaxed max-w-[260px]">
                AI-powered chess analysis and training for ambitious players.
              </p>
            </div>

            {/* Link groups */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <p className="text-[13px] uppercase tracking-widest font-medium text-secondary-foreground mb-4">
                  {group}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-secondary-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social */}
            <div>
              <p className="text-[13px] uppercase tracking-widest font-medium text-secondary-foreground mb-4">
                Connect
              </p>
              <ul className="space-y-3">
                {["Twitter", "GitHub", "Discord"].map((social) => (
                  <li key={social}>
                    <Link
                      href="#"
                      className="text-[14px] text-secondary-foreground hover:text-foreground transition-colors"
                    >
                      {social}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-[13px] text-secondary-foreground">
              &copy; 2025 Chessium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
