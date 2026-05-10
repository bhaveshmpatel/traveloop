"use client";

import { motion } from "framer-motion";
import {
  Map,
  Wallet,
  Search,
  CheckSquare,
  Share2,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Multi-City Itineraries",
    description:
      "Plan complex trips with multiple stops, dates, and activities — all organized in a beautiful timeline.",
    color: "from-teal-500 to-emerald-500",
    shadowColor: "shadow-teal-500/20",
  },
  {
    icon: Wallet,
    title: "Smart Budget Tracking",
    description:
      "Get real-time cost breakdowns by transport, stay, meals, and activities. Never go over budget again.",
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
  },
  {
    icon: Search,
    title: "Activity Discovery",
    description:
      "Browse and filter activities by type, cost, and duration. Find hidden gems in every destination.",
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
  },
  {
    icon: CheckSquare,
    title: "Packing Checklists",
    description:
      "Never forget essentials with per-trip packing lists categorized by clothing, documents, and more.",
    color: "from-violet-500 to-purple-500",
    shadowColor: "shadow-violet-500/20",
  },
  {
    icon: Share2,
    title: "Share & Inspire",
    description:
      "Share your itineraries with a public link. Let others copy your trip and get inspired.",
    color: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/20",
  },
  {
    icon: BookOpen,
    title: "Trip Journal",
    description:
      "Jot down notes, reminders, and reflections tied to each stop. Keep all details in one place.",
    color: "from-emerald-500 to-green-500",
    shadowColor: "shadow-emerald-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">plan perfectly</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            Powerful tools designed to make your travel planning effortless,
            organized, and fun.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className={`group relative p-8 rounded-3xl bg-surface border border-border hover:border-primary/20 hover:${feature.shadowColor} transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-bold font-[var(--font-outfit)] text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-3 text-text-secondary leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
