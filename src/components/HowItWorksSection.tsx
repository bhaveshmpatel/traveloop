"use client";

import { motion } from "framer-motion";
import { Route, Palette, Plane } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Route,
    title: "Plan Your Route",
    description:
      "Add cities, set travel dates, and outline your dream multi-city itinerary in minutes.",
    color: "from-primary to-primary-light",
    bgGlow: "bg-primary/10",
  },
  {
    number: "02",
    icon: Palette,
    title: "Customize Everything",
    description:
      "Discover activities, set budgets, create packing lists, and fine-tune every detail of your trip.",
    color: "from-accent to-accent-light",
    bgGlow: "bg-accent/10",
  },
  {
    number: "03",
    icon: Plane,
    title: "Travel & Share",
    description:
      "Hit the road with confidence. Journal your experience and share your itinerary with the world.",
    color: "from-violet-500 to-purple-400",
    bgGlow: "bg-violet-500/10",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
            Three steps to your{" "}
            <span className="text-gradient">perfect trip</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            From inspiration to destination — we make the journey as smooth as
            the trip itself.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-[16%] right-[16%] h-[2px] -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary via-accent to-violet-500 rounded-full"
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number + icon */}
                <div className="relative mb-8">
                  <div
                    className={`absolute inset-0 ${step.bgGlow} rounded-full blur-xl scale-150`}
                  />
                  <div
                    className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                    <span className="text-xs font-bold text-text-primary">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-3 text-text-secondary leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
