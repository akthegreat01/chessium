import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-[#a0a0a8] leading-relaxed">
          <p>Last updated: June 2026</p>
          
          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as your username, email address, and profile data when you create an account. We also automatically collect certain information when you visit, use, or navigate the platform, such as your IP address and device characteristics.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information, and to monitor and analyze trends, usage, and activities in connection with our platform.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">3. Sharing of Information</h2>
          <p>
            We do not share your personal information with third parties except as described in this privacy policy, such as with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">4. Data Security</h2>
          <p>
            We use appropriate technical and organizational measures to protect the personal information that we collect and process about you. The measures we use are designed to provide a level of security appropriate to the risk of processing your personal information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
