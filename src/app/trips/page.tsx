"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Plus,
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

const tabs = [
  { key: "ONGOING", label: "Ongoing" },
  { key: "PLANNING", label: "Upcoming" },
  { key: "COMPLETED", label: "Completed" },
];

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("ONGOING");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trips?status=${activeTab}`)
      .then((r) => r.json())
      .then((d) => {
        setTrips(d.trips || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    setTrips(trips.filter((t) => t.id !== id));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">
            My Trips 🗺️
          </h1>
          <p className="mt-1 text-text-secondary">
            Manage all your travel plans in one place
          </p>
        </motion.div>

        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> New Trip
        </Link>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trip cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">
            No{" "}
            {activeTab === "ONGOING"
              ? "ongoing"
              : activeTab === "PLANNING"
              ? "upcoming"
              : "completed"}{" "}
            trips
          </h3>
          <p className="text-text-secondary mb-6">
            {activeTab === "PLANNING"
              ? "Start planning your next adventure!"
              : "Check your other tabs or create a new trip"}
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <Plus className="w-4 h-4" /> Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
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
                <h3 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary">
                  {trip.name}
                </h3>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
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

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <Link
                    href={`/trips/${trip.id}/itinerary`}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link
                    href={`/trips/${trip.id}/itinerary`}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary bg-surface-elevated rounded-lg hover:bg-border/50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
