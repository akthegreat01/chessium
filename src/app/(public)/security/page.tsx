import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Server } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-secondary-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> Security at Chessium
        </h1>
        <p className="text-secondary-foreground mb-12">Your games and data are safe with us.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface border border-border rounded-xl p-6">
            <Lock className="w-6 h-6 text-primary mb-4" />
            <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-[14px] text-secondary-foreground">All traffic between your browser and our servers is encrypted using industry-standard TLS protocols.</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <Server className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="font-semibold mb-2">Secure Infrastructure</h3>
            <p className="text-[14px] text-secondary-foreground">Our backend runs on hardened cloud infrastructure with continuous monitoring and automated backups.</p>
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-secondary-foreground prose-headings:text-foreground prose-a:text-primary max-w-none">
          <h2>Responsible Disclosure</h2>
          <p>
            If you believe you have discovered a security vulnerability in Chessium, please report it to security@chessium.app. We take all reports seriously and will investigate promptly.
          </p>
        </div>
      </div>
    </div>
  );
}
