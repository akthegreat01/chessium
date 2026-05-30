"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroBoard from "@/components/home/HeroBoard";
import { motion } from "framer-motion";
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
  Product: ["Features", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers"],
  Legal: ["Terms", "Privacy", "Security"],
};

const fakeMoves = [
  { number: 1, white: "e4", black: "e5" },
  { number: 2, white: "Nf3", black: "Nc6" },
  { number: 3, white: "Bb5", black: "a6" },
  { number: 4, white: "Ba4", black: "Nf6" },
];

export default function LandingContent({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-48 md:pt-56 pb-32 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-7xl md:text-[88px] font-bold tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
                delay: 0.1,
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
                delay: 0.2,
              }}
            >
              <Link href={user ? "/home" : "/signup"}>
                <Button className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-[15px] font-medium rounded-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-border bg-transparent hover:bg-white/[0.04] h-12 px-8 text-[15px] font-medium rounded-lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Product Mockup */}
          <motion.div
            className="relative mt-20 md:mt-28"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.35,
            }}
          >
            {/* Golden glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[600px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
            </div>

            <div className="relative bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                <span className="ml-4 text-[13px] text-secondary-foreground font-medium">
                  Chessium — AI Analysis
                </span>
              </div>

              {/* Dashboard content */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-0">
                {/* Chessboard */}
                <div className="p-6 md:p-8 flex items-center justify-center">
                  <div className="w-full max-w-[480px]">
                    <HeroBoard />
                  </div>
                </div>

                {/* Analysis panel */}
                <div className="border-t md:border-t-0 md:border-l border-border p-6 md:p-8 flex flex-col gap-6">
                  <div>
                    <p className="text-[13px] uppercase tracking-widest font-medium text-secondary-foreground">
                      AI Analysis
                    </p>
                  </div>

                  {/* Accuracy */}
                  <div>
                    <p className="text-[13px] text-secondary-foreground mb-1">
                      Accuracy
                    </p>
                    <p className="text-4xl font-bold tracking-tight">94.2%</p>
                  </div>

                  {/* Best Move */}
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-[13px] text-secondary-foreground">
                        Best Move
                      </p>
                      <p className="text-lg font-bold">Nf3</p>
                    </div>
                  </div>

                  {/* Mistakes */}
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div>
                      <p className="text-[13px] text-secondary-foreground">
                        Mistakes
                      </p>
                      <p className="text-lg font-bold">2</p>
                    </div>
                  </div>

                  {/* Move list */}
                  <div className="mt-auto">
                    <p className="text-[13px] uppercase tracking-widest font-medium text-secondary-foreground mb-3">
                      Moves
                    </p>
                    <div className="space-y-0">
                      {fakeMoves.map((move) => (
                        <div
                          key={move.number}
                          className="flex items-center text-[14px] py-1.5 border-b border-border last:border-0"
                        >
                          <span className="w-8 text-secondary-foreground font-medium">
                            {move.number}.
                          </span>
                          <span className="w-16 font-medium">{move.white}</span>
                          <span className="w-16 text-secondary-foreground">
                            {move.black}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
                className="bg-surface border border-border rounded-xl p-10 transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_0_40px_rgba(212,175,55,0.03)]"
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-xl p-8 md:p-10 border flex flex-col ${
                  plan.highlighted
                    ? "bg-surface border-primary/30 shadow-[0_0_60px_rgba(212,175,55,0.06)]"
                    : "bg-surface border-border"
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <p className="text-[13px] uppercase tracking-widest font-medium text-secondary-foreground mb-4">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-secondary-foreground text-[15px]">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3.5 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[15px]"
                    >
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-11 text-[14px] font-medium rounded-lg ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-surface border border-border hover:bg-white/[0.04]"
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
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
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-[14px] text-secondary-foreground hover:text-foreground transition-colors"
                      >
                        {link}
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
