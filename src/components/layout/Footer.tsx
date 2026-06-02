import React from 'react';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Analysis', href: '/analysis' },
    { label: 'Play Online', href: '/play' },
    { label: 'Puzzles', href: '/puzzles' },
    { label: 'Courses', href: '/courses' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Learn: [
    { label: 'Blog', href: '/blog' },
    { label: 'Openings', href: '/learn/openings' },
    { label: 'Endgames', href: '/learn/endgames' },
    { label: 'Tactics', href: '/learn/tactics' },
    { label: 'Strategy', href: '/learn/strategy' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'Press Kit', href: '/press' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'DMCA', href: '/dmca' },
  ],
};


export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Logo + tagline */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Chessium Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold tracking-wider text-text-primary">
                CHESSIUM
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-tertiary">
              The modern chess platform. Analyze your games with Stockfish,
              solve puzzles, learn from courses, and elevate your play.
            </p>
            {/* Developer Info */}
            <div className="mt-6 text-sm text-text-tertiary">
              Developed by <strong className="text-white">Akshath Kataria</strong>, a 17-year-old developer.
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold tracking-wide text-text-primary">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-tertiary transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Chessium. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Made with ♟ for chess lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
