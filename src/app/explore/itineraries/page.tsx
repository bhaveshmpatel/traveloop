"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, DollarSign, Calendar, MapPin, Globe, Copy, Loader2 } from "lucide-react";

interface Trip {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  budget: number | null;
  stops: { city: { name: string; country: string; region: string } }[];
  user: { firstName: string; lastName: string };
}

export default function ItinerariesPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/itineraries?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { setTrips(d.trips || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Browse Itineraries 📋</h1>
        <p className="mt-2 text-text-secondary">Get inspired by public trip plans from the community</p>
      </motion.div>

      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search itineraries..."
          className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20"><Globe className="w-16 h-16 mx-auto text-text-muted mb-4" /><p className="text-text-secondary">No public itineraries found yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <h3 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary">{trip.name}</h3>
              <p className="text-sm text-text-muted mt-1">by {trip.user.firstName} {trip.user.lastName}</p>
              {trip.description && <p className="mt-3 text-sm text-text-secondary line-clamp-2">{trip.description}</p>}

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  {formatDate(trip.startDate)} → {formatDate(trip.endDate)} ({getDuration(trip.startDate, trip.endDate)} days)
                </div>
                {trip.stops.length > 0 && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-4 h-4 text-text-muted" />
                    {trip.stops.map((s) => s.city.name).slice(0, 4).join(", ")}
                  </div>
                )}
                {trip.budget && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <DollarSign className="w-4 h-4 text-text-muted" />${trip.budget.toLocaleString()} budget
                  </div>
                )}
              </div>

              {/* Budget breakdown placeholder */}
              {trip.budget && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-text-muted mb-2">Est. Budget Split</p>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 w-[30%]" title="Transport" />
                    <div className="bg-violet-500 w-[25%]" title="Stay" />
                    <div className="bg-amber-500 w-[25%]" title="Food" />
                    <div className="bg-emerald-500 w-[20%]" title="Activities" />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-muted mt-1">
                    <span>Transport</span><span>Stay</span><span>Food</span><span>Activities</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Link href={`/trips/${trip.id}/itinerary`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                  View Itinerary
                </Link>
                <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-text-secondary bg-surface-elevated rounded-xl hover:text-primary transition-colors">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
