"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Destinations", href: "#destinations" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-strong shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                <Plane className="w-5 h-5 text-white rotate-[-30deg]" />
              </div>
              <span className="text-xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
                Travel
                <span className="text-gradient">oop</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href="/auth"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-elevated transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="mx-4 mt-2 rounded-2xl glass-strong shadow-2xl p-6">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-base font-medium text-text-primary hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="my-3 border-border" />
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-4 py-3 text-center text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
