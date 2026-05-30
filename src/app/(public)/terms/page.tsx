import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-secondary-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-secondary-foreground mb-12">Last updated: May 30, 2026</p>

        <div className="prose prose-invert prose-p:text-secondary-foreground prose-headings:text-foreground prose-a:text-primary max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Chessium. By accessing our platform, you agree to these terms. We provide AI-powered chess analysis and training tools designed to help you master every move.
          </p>

          <h2>2. User Accounts</h2>
          <p>
            You are responsible for safeguarding your account credentials. Any activity occurring under your account is your responsibility. We reserve the right to suspend or terminate accounts that violate fair play policies.
          </p>

          <h2>3. Fair Play Policy</h2>
          <p>
            Chessium is dedicated to maintaining a fair and competitive environment. Using our AI tools during rated games on external platforms is strictly prohibited. Our tools are designed for post-game analysis and training only.
          </p>

          <h2>4. Subscription and Billing</h2>
          <p>
            Some features of Chessium require a premium subscription. By subscribing, you agree to our recurring billing terms. You may cancel your subscription at any time, but refunds are not provided for partial billing periods.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on Chessium, including text, graphics, logos, and software, is the property of Chessium or its licensors and is protected by intellectual property laws.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Chessium is provided "as is" without any warranties. We are not liable for any damages arising from your use of the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
