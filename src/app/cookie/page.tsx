import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookie Policy</h1>
        <div className="space-y-6 text-[#a0a0a8] leading-relaxed">
          <p>Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">1. What are cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">2. How we use cookies</h2>
          <p>
            Chessium uses cookies to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Keep you signed in to your account.</li>
            <li>Remember your preferences (e.g., board theme, piece style).</li>
            <li>Understand how you use our platform so we can improve it.</li>
            <li>Provide personalized content and features.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">3. Managing cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
