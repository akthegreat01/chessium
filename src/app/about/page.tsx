import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">About Chessium</h1>
        <div className="space-y-6 text-[#a0a0a8] leading-relaxed">
          <p className="text-xl text-white mb-8">
            Chessium is the modern chess platform designed for players who want to analyze, learn, and improve faster.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Our Mission</h2>
          <p>
            Our mission is to democratize chess improvement. We believe that world-class analysis, comprehensive courses, and high-quality puzzles should be accessible to everyone. That's why Chessium is completely free.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Platform</h2>
          <p>
            Built from the ground up for performance and aesthetics, Chessium utilizes the powerful Stockfish engine to provide instant, deep analysis of your games. We offer a seamless interface for reviewing moves, identifying blunders, and learning the theory behind openings and endgames.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Developer</h2>
          <p>
            Chessium is developed by Akshath Kataria, a 17-year-old developer passionate about chess and building world-class software. Chessium is born out of a desire to create a truly beautiful and frictionless chess experience on the web.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
