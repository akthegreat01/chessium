import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Underpromotion chess analysis platform. Read our usage terms, disclaimers, and user agreements.',
};

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: '#d4af37' }}>Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: May 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-black text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using Underpromotion (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service. Underpromotion reserves the right 
              to modify these terms at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">2. Description of Service</h2>
            <p className="text-gray-400 leading-relaxed">
              Underpromotion is a free, browser-based chess analysis platform powered by the Stockfish chess engine 
              (WebAssembly). The Service provides game analysis, tactical puzzles, educational content, and chess 
              tools. All computation is performed locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">3. Use of Service</h2>
            <p className="text-gray-400 leading-relaxed">You agree to use the Service only for lawful purposes. You shall not:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mt-2">
              <li>Use the Service to gain an unfair advantage in online chess games</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code</li>
              <li>Use automated systems to access the Service in a manner that exceeds reasonable use</li>
              <li>Distribute, license, or sell any content obtained from the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">4. Intellectual Property</h2>
            <p className="text-gray-400 leading-relaxed">
              The design, layout, and original content of Underpromotion are protected by intellectual property laws. 
              The Stockfish chess engine is used under the GNU General Public License (GPL). Chess game data and 
              positions are in the public domain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">5. Disclaimer of Warranties</h2>
            <p className="text-gray-400 leading-relaxed">
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service 
              will be error-free, uninterrupted, or that analysis results will be perfectly accurate. Chess engine 
              evaluations are computational approximations and should not be relied upon as absolute assessments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed">
              Underpromotion and its creator shall not be liable for any indirect, incidental, special, or 
              consequential damages arising from your use of the Service. Total liability shall not exceed 
              the amount paid by you to use the Service (which is zero, as the Service is free).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">7. Third-Party Services</h2>
            <p className="text-gray-400 leading-relaxed">
              The Service may integrate with third-party platforms (Chess.com, Lichess) for game imports. 
              We are not responsible for the availability, accuracy, or terms of these third-party services. 
              Google AdSense is used for advertising; Google&apos;s privacy policy applies to ad-related data collection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">8. Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              We reserve the right to update these Terms at any time. Continued use of the Service after 
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">9. Contact</h2>
            <p className="text-gray-400 leading-relaxed">
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:akshathkataria@gmail.com" className="text-[#d4af37] hover:underline">akshathkataria@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
