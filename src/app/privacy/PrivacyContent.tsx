"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

export default function PrivacyContent() {
  const lastUpdated = "May 5, 2026";

  const sections = [
    {
      title: "Data Collection",
      icon: <Eye className="w-5 h-5 text-blue-400" />,
      content: "We collect minimal data necessary to provide our services. This includes log files which contain IP addresses, browser type, Internet Service Provider (ISP), date/time stamps, and referring/exit pages. This information is used to analyze trends, administer the site, and track users' movement around the website."
    },
    {
      title: "Google AdSense & Cookies",
      icon: <Shield className="w-5 h-5 text-[#d4af37]" />,
      content: "Google, as a third-party vendor, uses cookies to serve ads on Chessium. Google's use of the DART cookie enables it to serve ads to our users based on their visit to Chessium and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy."
    },
    {
      title: "Third-Party Advertising",
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      content: "Third-party ad servers or ad networks use technology in their respective advertisements and links that appear on Chessium and which are sent directly to your browser. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by our site's third-party ad networks to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on the site."
    },
    {
      title: "Children's Information",
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      content: "We believe it is important to provide added protection for children online. We encourage parents and guardians to spend time online with their children to observe, participate in and/or monitor and guide their online activity. Chessium does not knowingly collect any personally identifiable information from children under the age of 13."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Legal Documentation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Your privacy is paramount. This policy outlines how we handle data and ensure your security while using Chessium.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            <span>Last Updated: {lastUpdated}</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Version 1.2</span>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="grid gap-12">
          {sections.map((section, idx) => (
            <motion.section 
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="relative group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 transition-colors">
                    {section.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    {section.title}
                    <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm"
        >
          <h3 className="text-white font-bold mb-4">Questions or Concerns?</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            If you require any more information or have any questions about our privacy policy, please feel free to contact us by email at 
            <a href="mailto:privacy@chessium.app" className="text-[#d4af37] hover:underline ml-1">privacy@chessium.app</a>.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <Lock className="w-3 h-3" />
            <span>Secure Data Processing</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
