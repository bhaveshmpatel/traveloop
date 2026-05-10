"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

const destinations = [
  {
    name: "Santorini",
    country: "Greece",
    image: "/images/hero-santorini.png",
    rating: 4.9,
    trips: "12K+ trips",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: "/images/destination-bali.png",
    rating: 4.8,
    trips: "18K+ trips",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    image: "/images/destination-swiss.png",
    rating: 4.9,
    trips: "9K+ trips",
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: "/images/destination-tokyo.png",
    rating: 4.7,
    trips: "15K+ trips",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function DestinationsSection() {
  return (
    <section
      id="destinations"
      className="py-24 sm:py-32 bg-surface-elevated/50 relative"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Popular Destinations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
            Explore <span className="text-gradient">trending</span> places
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            Get inspired by the most popular destinations loved by travelers
            worldwide.
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.name}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Rating badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full glass text-white text-sm font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {dest.rating}
                </div>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-1.5 text-white/70 text-sm mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {dest.country}
                </div>
                <h3 className="text-2xl font-bold font-[var(--font-outfit)] text-white">
                  {dest.name}
                </h3>
                <p className="mt-1 text-white/60 text-sm">{dest.trips}</p>

                {/* Hover reveal button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="inline-block px-4 py-2 text-sm font-medium text-white bg-primary/80 backdrop-blur rounded-xl">
                    Explore →
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
