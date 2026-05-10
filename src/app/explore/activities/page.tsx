"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, DollarSign, Tag, Compass } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  type: string;
  description: string | null;
  cost: number;
  duration: number;
  city: { name: string; country: string };
}

const types = ["All", "SIGHTSEEING", "FOOD", "ADVENTURE", "CULTURE", "NATURE", "SHOPPING"];
const typeColors: Record<string, string> = {
  SIGHTSEEING: "bg-blue-500", FOOD: "bg-amber-500", ADVENTURE: "bg-red-500",
  CULTURE: "bg-violet-500", NATURE: "bg-emerald-500", SHOPPING: "bg-pink-500",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (maxCost) params.set("maxCost", maxCost);
    fetch(`/api/activities?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { setActivities(d.activities || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, type, maxCost]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Discover Activities 🎯</h1>
        <p className="mt-2 text-text-secondary">Find things to do in every destination</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select value={type} onChange={(e) => setType(e.target.value === "All" ? "" : e.target.value)}
            className="pl-10 pr-8 py-3 bg-surface border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer">
            {types.map((t) => <option key={t} value={t === "All" ? "" : t}>{t === "All" ? "All Types" : t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input type="number" value={maxCost} onChange={(e) => setMaxCost(e.target.value)} placeholder="Max cost"
            className="pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-36" />
        </div>
      </div>

      {/* Activity cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-surface-elevated rounded-2xl animate-pulse" />)}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20"><Compass className="w-16 h-16 mx-auto text-text-muted mb-4" /><p className="text-text-secondary">No activities found.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act, i) => (
            <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${typeColors[act.type] || "bg-gray-500"} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {act.type[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold font-[var(--font-outfit)] text-text-primary text-lg">{act.name}</h3>
                  <p className="text-sm text-text-muted flex items-center gap-1"><Tag className="w-3 h-3" />{act.type.charAt(0) + act.type.slice(1).toLowerCase()}</p>
                </div>
              </div>
              {act.description && <p className="text-sm text-text-secondary mb-4 line-clamp-2">{act.description}</p>}
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${act.cost}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{act.duration}h</span>
                <span className="ml-auto text-xs text-text-muted">{act.city.name}, {act.city.country}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
