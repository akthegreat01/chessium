import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-secondary-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-secondary-foreground mb-12">Last updated: May 30, 2026</p>

        <div className="prose prose-invert prose-p:text-secondary-foreground prose-headings:text-foreground prose-a:text-primary max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, analyze a game, or communicate with us. This includes your email address, gameplay data (PGNs, FENs), and usage metrics.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services. Specifically, your gameplay data is used to train our AI models and provide you with personalized insights and puzzle recommendations.
          </p>

          <h2>3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We may share aggregated, non-personally identifiable gameplay statistics for research or marketing purposes.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </div>
      </div>
    </div>
  );
}
