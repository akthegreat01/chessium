'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { label: 'Analysis', href: '/analysis' },
  { label: 'Play', href: '/play' },
  { label: 'Puzzles', href: '/puzzles' },
  { label: 'Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
];

interface NavbarProps {
  user?: { name: string; avatar?: string } | null;
  onLogin?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
}

function KnightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 22H5v-2h14v2M13 2c-1.25 0-2.42.62-3.11 1.66L7 8l2 2 2.06-2.06C11.28 8.56 12 9.44 12 10.5V16h2v-5.5c0-1.7-.76-3.27-2.06-4.31L14 4h5V2h-6z" />
    </svg>
  );
}

export default function Navbar({
  user = null,
  onLogin,
  onSignUp,
  onLogout,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50">
      <div className="border-b border-border bg-[rgba(10,10,11,0.8)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <KnightIcon className="h-7 w-7 text-accent transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-wider text-text-primary">
              CHESSIUM
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth / user */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogout}
                  className="text-sm text-text-tertiary transition-colors hover:text-text-secondary"
                >
                  Logout
                </button>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-bg-tertiary px-3 py-1.5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-text-primary">
                    {user.name}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  Login
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSignUp}
                  className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(129,182,76,0.15)] transition-colors hover:bg-accent-hover"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-72 border-l border-border bg-bg-primary md:hidden"
            >
              <div className="flex flex-col p-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="my-6 h-px bg-border" />

                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-tertiary p-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-text-primary">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onLogin?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onSignUp?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
