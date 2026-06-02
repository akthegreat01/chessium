import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-[#a0a0a8] leading-relaxed">
          <p>Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">1. Introduction</h2>
          <p>
            Welcome to Chessium. By accessing and using our website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">2. Use of Platform</h2>
          <p>
            Chessium is a free platform dedicated to helping players improve their chess skills. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of Chessium.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">3. Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">4. Intellectual Property</h2>
          <p>
            The platform and its original content, features, and functionality are and will remain the exclusive property of Chessium and its licensors. Chess engines used on the site, such as Stockfish, are open source and subject to their respective licenses.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">5. Fair Play</h2>
          <p>
            Chessium strictly enforces fair play in all games played against other users. Use of external engines during live human play is strictly prohibited and will result in a permanent ban.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
