import { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Underpromotion team. Questions, feedback, or partnership inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: '#d4af37' }}>Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">
            Have a question, found a bug, or want to suggest a feature? We&#39;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "Email", value: "akshathkataria@gmail.com", href: "mailto:akshathkataria@gmail.com" },
            { icon: MapPin, title: "Location", value: "India", href: undefined },
            { icon: Clock, title: "Response Time", value: "Within 48 hours", href: undefined },
          ].map(item => (
            <div key={item.title} className="glass-panel p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.15)' }}>
                <item.icon className="w-5 h-5" style={{ color: '#d4af37' }} />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
              {item.href ? (
                <a href={item.href} className="text-gray-400 text-sm hover:text-[#d4af37] transition-colors">{item.value}</a>
              ) : (
                <p className="text-gray-400 text-sm">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-xl font-black text-white mb-6">Send a Message</h2>
          <form className="space-y-5" action={`mailto:akshathkataria@gmail.com`} method="post" encType="text/plain">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Name</label>
                <input type="text" name="name" placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:border-[#d4af37]/40 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" name="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:border-[#d4af37]/40 focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Subject</label>
              <input type="text" name="subject" placeholder="What is this about?" className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:border-[#d4af37]/40 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Message</label>
              <textarea name="message" rows={5} placeholder="Tell us what you're thinking..." className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:border-[#d4af37]/40 focus:outline-none transition-colors resize-none" />
            </div>
            <button type="submit" className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-[0.1em] font-black">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
