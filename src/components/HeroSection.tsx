"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, MapPin, Globe, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-santorini.png"
          alt="Beautiful Santorini landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-32 right-16 hidden lg:block"
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
          <Globe className="w-8 h-8 text-primary-light" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-32 hidden lg:block"
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
          <Compass className="w-6 h-6 text-accent-light" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-60 left-10 hidden lg:block"
        animate={{ y: [5, -15, 5] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
          <MapPin className="w-5 h-5 text-pink-400" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-white/90">
              <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
              Your next adventure starts here
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[var(--font-outfit)] leading-[1.1] tracking-tight text-white"
          >
            Plan Your Dream{" "}
            <span className="relative">
              <span className="text-gradient">Trip</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{ transformOrigin: "left" }}
              />
            </span>
            ,<br />
            <span className="text-white/80">Effortlessly.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed"
          >
            Create multi-city itineraries, track your budget, discover amazing
            activities, and share your plans — all in one beautiful platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/auth"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
            >
              Start Planning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white glass rounded-2xl hover:bg-white/15 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 flex items-center gap-8 sm:gap-12"
          >
            {[
              { value: "50K+", label: "Trips Planned" },
              { value: "120+", label: "Countries" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold font-[var(--font-outfit)] text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
