"use client";

import { motion } from "framer-motion";
import { Plane, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Destinations", href: "#destinations" },
    { label: "Pricing", href: "#" },
    { label: "Mobile App", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8"
        >
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/20">
                <Plane className="w-5 h-5 text-white rotate-[-30deg]" />
              </div>
              <span className="text-xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
                Travel<span className="text-gradient">oop</span>
              </span>
            </Link>
            <p className="mt-4 text-text-secondary max-w-sm leading-relaxed">
              Dream, design, and organize trips with ease. Your all-in-one
              travel planning companion for unforgettable adventures.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-text-primary mb-3">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Traveloop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "Instagram", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
