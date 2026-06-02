"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    if (n >= 1_000) return (n / 1_000).toFixed(0);
    return n.toString();
  };

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
      {formatNumber(count)}
      <span className="text-[#81b64c]">{suffix}</span>
    </div>
  );
}

function StatItem({ value, suffix, label, icon, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#81b64c]/10 text-[#81b64c] mb-4">
        {icon}
      </div>
      <AnimatedNumber value={value} suffix={suffix} />
      <div className="text-[#6b6b75] text-sm mt-2">{label}</div>
    </motion.div>
  );
}

export default function SocialProof() {
  const stats = [
    {
      value: 1,
      suffix: "M+",
      label: "Games Analyzed",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      ),
    },
    {
      value: 500,
      suffix: "K+",
      label: "Puzzles Solved",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
    {
      value: 100,
      suffix: "K+",
      label: "Active Users",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      value: 150,
      suffix: "+",
      label: "Countries Reached",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2a2a30] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2a2a30] to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Trusted by chess players{" "}
            <span className="text-[#81b64c]">worldwide</span>
          </h2>
          <p className="text-[#6b6b75]">
            Join thousands of players improving their game every day
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
