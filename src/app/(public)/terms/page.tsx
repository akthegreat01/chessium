import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-secondary-foreground hover:text-foreground transition-colors mb-12 bg-surface/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">
            Terms of Service
          </h1>
          <p className="text-secondary-foreground font-medium">Last updated: May 30, 2026</p>
        </div>

        <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-14 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="prose prose-invert prose-p:text-secondary-foreground/90 prose-headings:text-foreground prose-a:text-primary max-w-none prose-lg">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Chessium. By accessing our platform, you agree to these terms. We provide AI-powered chess analysis and training tools designed to help you master every move. Our goal is to provide a premium environment for serious players.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              You are responsible for safeguarding your account credentials. Any activity occurring under your account is your responsibility. We reserve the right to suspend or terminate accounts that violate fair play policies.
            </p>

            <h2>3. Fair Play Policy</h2>
            <p>
              Chessium is dedicated to maintaining a fair and competitive environment. <strong>Using our AI tools during rated games on external platforms is strictly prohibited.</strong> Our tools are designed exclusively for post-game analysis and training. Violations of this policy will result in an immediate ban.
            </p>

            <h2>4. Subscription and Billing</h2>
            <p>
              Some features of Chessium require a premium subscription. By subscribing, you agree to our recurring billing terms. You may cancel your subscription at any time, but refunds are not provided for partial billing periods.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content on Chessium, including text, graphics, logos, and software, is the property of Chessium or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              Chessium is provided "as is" without any warranties, express or implied. We are not liable for any damages arising from your use of the platform, including but not loss of data, loss of rating points, or inability to access the service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
