"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Globe2,
  Sparkles,
} from "lucide-react";

interface Trip {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  startDate: string;
  endDate: string;
  status: string;
  budget: number | null;
  stops: { city: { name: string; country: string; imageUrl: string | null } }[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const regions = [
  { name: "Asia", emoji: "🌏", color: "from-amber-500 to-orange-500", cities: "Tokyo, Bali, Bangkok..." },
  { name: "Europe", emoji: "🏰", color: "from-blue-500 to-indigo-500", cities: "Paris, Rome, Barcelona..." },
  { name: "Americas", emoji: "🗽", color: "from-emerald-500 to-teal-500", cities: "New York, Rio, Cancún..." },
  { name: "Africa", emoji: "🌍", color: "from-amber-600 to-yellow-500", cities: "Cape Town, Marrakech..." },
  { name: "Oceania", emoji: "🏝️", color: "from-cyan-500 to-blue-400", cities: "Sydney, Queenstown..." },
  { name: "Middle East", emoji: "🕌", color: "from-violet-500 to-purple-500", cities: "Dubai, Petra..." },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => d.user && setUser(d.user));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (filterStatus) params.set("status", filterStatus);
    fetch(`/api/trips?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setTrips(d.trips || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, sortBy, filterStatus]);

  const previousTrips = trips.filter((t) => t.status === "COMPLETED");
  const recentTrips = trips.slice(0, 6);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src="/images/dashboard-banner.png"
          alt="Travel Dashboard"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-outfit)] text-white">
                Welcome back,{" "}
                <span className="text-teal-300">
                  {user?.firstName || "Traveler"}
                </span>
                ! 👋
              </h1>
              <p className="mt-2 text-lg text-white/70 max-w-xl">
                Ready to plan your next adventure? Explore destinations and
                build your dream itinerary.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-4 shadow-xl mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trips..."
                className="w-full pl-12 pr-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
              >
                <option value="createdAt">Sort: Recent</option>
                <option value="name">Sort: Name</option>
                <option value="startDate">Sort: Date</option>
                <option value="budget">Sort: Budget</option>
              </select>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-surface-elevated border-border text-text-secondary hover:text-primary hover:border-primary/30"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Group by (visual only) */}
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-elevated text-text-secondary text-sm font-medium hover:text-primary hover:border-primary/30 transition-all">
              <LayoutGrid className="w-4 h-4" />
              Group
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2"
            >
              {["", "PLANNING", "ONGOING", "COMPLETED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === status
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-surface-elevated text-text-secondary hover:text-primary border border-border"
                  }`}
                >
                  {status || "All Trips"}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Top Regional Selections */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">
                <Globe2 className="w-6 h-6 inline-block mr-2 text-primary" />
                Explore Regions
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Discover destinations across the world
              </p>
            </div>
            <Link
              href="/explore/cities"
              className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {regions.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <Link
                  href={`/explore/cities?region=${region.name}`}
                  className={`group block p-5 rounded-2xl bg-gradient-to-br ${region.color} text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <span className="text-3xl">{region.emoji}</span>
                  <h3 className="mt-3 font-bold font-[var(--font-outfit)] text-lg">
                    {region.name}
                  </h3>
                  <p className="mt-1 text-white/70 text-xs leading-relaxed">
                    {region.cities}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">
                  <Sparkles className="w-6 h-6 inline-block mr-2 text-accent" />
                  Your Trips
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Continue planning or review your journeys
                </p>
              </div>
              <Link
                href="/trips"
                className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                >
                  <Link
                    href={`/trips/${trip.id}/itinerary`}
                    className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Cover */}
                    <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20">
                      {(trip.coverImage || (trip.stops.length > 0 && trip.stops[0].city.imageUrl)) && (
                        <Image
                          src={trip.coverImage || trip.stops[0].city.imageUrl!}
                          alt={trip.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            trip.status === "COMPLETED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : trip.status === "ONGOING"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary group-hover:text-primary transition-colors">
                        {trip.name}
                      </h3>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Calendar className="w-4 h-4 text-text-muted" />
                          {formatDate(trip.startDate)} →{" "}
                          {formatDate(trip.endDate)}
                        </div>
                        {trip.stops.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <MapPin className="w-4 h-4 text-text-muted" />
                            {trip.stops
                              .map((s) => s.city.name)
                              .slice(0, 3)
                              .join(", ")}
                            {trip.stops.length > 3 &&
                              ` +${trip.stops.length - 3}`}
                          </div>
                        )}
                        {trip.budget && (
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <DollarSign className="w-4 h-4 text-text-muted" />$
                            {trip.budget.toLocaleString()} budget
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Previous Trips */}
        {previousTrips.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary mb-6">
              Previous Trips
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x">
              {previousTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}/itinerary`}
                  className="flex-shrink-0 w-72 bg-surface border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 snap-start"
                >
                  <h3 className="font-bold font-[var(--font-outfit)] text-text-primary">
                    {trip.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                      Completed
                    </span>
                    {trip.stops.length > 0 && (
                      <span className="text-xs text-text-muted">
                        {trip.stops.length} stops
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading && trips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">
              No trips yet
            </h3>
            <p className="mt-2 text-text-secondary max-w-md mx-auto">
              Start by planning your first adventure! Explore destinations and
              create your dream itinerary.
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 mt-6 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Plan Your First Trip
            </Link>
          </motion.div>
        )}
      </div>

      {/* Floating Plan a Trip button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Link
          href="/trips/new"
          className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Plan a Trip</span>
        </Link>
      </motion.div>
    </div>
  );
}
