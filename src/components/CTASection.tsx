"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-teal-900" />

          {/* Animated decorative shapes */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.06]"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/[0.04]"
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-10 left-1/3 w-40 h-40 rounded-full bg-accent/10"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/90 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Start your journey today
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-outfit)] text-white leading-tight max-w-3xl mx-auto">
              Ready to plan your
              <br />
              next adventure?
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Join thousands of travelers who plan smarter, explore more, and
              never miss a moment.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth"
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-white text-primary rounded-2xl shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-105 transition-all duration-300"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-white/50 text-sm">
                No credit card required
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
