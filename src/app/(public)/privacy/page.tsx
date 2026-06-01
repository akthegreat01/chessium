import React from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-secondary-foreground hover:text-foreground transition-colors mb-12 bg-surface  px-4 py-2 rounded-full border border-white/5 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LockKeyhole className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">
            Privacy Policy
          </h1>
          <p className="text-secondary-foreground font-medium">Last updated: May 30, 2026</p>
        </div>

        <div className="bg-surface  border border-white/10 rounded-[32px] p-8 md:p-14 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="prose prose-invert prose-p:text-secondary-foreground/90 prose-headings:text-foreground prose-a:text-primary max-w-none prose-lg">
            <h2>1. Information We Collect</h2>
            <p>
              When you use Chessium, we collect information necessary to provide and improve our services. This includes account details (email address, username), gameplay data (PGNs, ratings, move histories), and technical information (IP addresses, device information).
            </p>

            <h2>2. How We Use Your Data</h2>
            <p>
              We use your data strictly to operate our platform. This includes processing AI evaluations of your games, generating personalized training recommendations, providing customer support, and maintaining the security of the platform. We do not sell your personal data to third parties.
            </p>

            <h2>3. Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use secure databases provided by trusted infrastructure partners to ensure your account information and game analyses are safe from unauthorized access.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              We integrate with secure third-party services (like payment processors and authentication providers). These services are governed by their own privacy policies. We only share the minimum amount of data required for these integrations to function.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              You have the right to access, modify, or permanently delete your personal data. You can exercise these rights directly from your account settings or by contacting our support team. Upon deletion, your data will be permanently removed from our active databases.
            </p>

            <h2>6. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time as our platform evolves. We will notify you of any significant changes via email or an in-app announcement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
