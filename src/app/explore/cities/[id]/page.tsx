"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Globe, Star, DollarSign, Clock, Tag, Loader2, Compass,
} from "lucide-react";

interface Activity {
  id: string; name: string; type: string; description: string | null;
  cost: number; duration: number;
}

interface City {
  id: string; name: string; country: string; region: string;
  costIndex: number; popularity: number; description: string | null;
  imageUrl: string | null; latitude: number | null; longitude: number | null;
  activities: Activity[];
}

const typeColors: Record<string, string> = {
  SIGHTSEEING: "bg-blue-500", FOOD: "bg-amber-500", ADVENTURE: "bg-red-500",
  CULTURE: "bg-violet-500", NATURE: "bg-emerald-500", SHOPPING: "bg-pink-500",
};
const typeEmoji: Record<string, string> = {
  SIGHTSEEING: "👁️", FOOD: "🍽️", ADVENTURE: "🏔️",
  CULTURE: "🏛️", NATURE: "🌿", SHOPPING: "🛍️",
};

const costLabels = ["", "💰 Budget", "💰💰 Affordable", "💰💰💰 Moderate", "💰💰💰💰 Pricey", "💰💰💰💰💰 Luxury"];

export default function CityDetailPage() {
  const params = useParams();
  const cityId = params.id as string;
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetch(`/api/cities/${cityId}`)
      .then((r) => r.json())
      .then((d) => { setCity(d.city || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cityId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!city) return <div className="text-center py-20"><p className="text-text-secondary">City not found.</p></div>;

  const filtered = filterType ? city.activities.filter((a) => a.type === filterType) : city.activities;
  const types = [...new Set(city.activities.map((a) => a.type))];
  const avgCost = city.activities.length ? Math.round(city.activities.reduce((s, a) => s + a.cost, 0) / city.activities.length) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/explore/cities" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cities
      </Link>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8">
        <div className="h-64 sm:h-80 bg-gradient-to-br from-primary/30 to-accent/30">
          {city.imageUrl && <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <MapPin className="w-4 h-4" />{city.country}
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">{city.region}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-outfit)] text-white">{city.name}</h1>
        </div>
      </motion.div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Star, label: "Popularity", value: `${city.popularity}/100`, color: "from-amber-500 to-orange-500" },
          { icon: DollarSign, label: "Cost Level", value: costLabels[city.costIndex] || "N/A", color: "from-emerald-500 to-teal-500" },
          { icon: Compass, label: "Activities", value: `${city.activities.length} available`, color: "from-blue-500 to-indigo-500" },
          { icon: Globe, label: "Avg. Cost", value: `$${avgCost}/activity`, color: "from-violet-500 to-purple-500" },
        ].map((card) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white`}>
            <card.icon className="w-5 h-5 opacity-80 mb-1" />
            <p className="text-lg font-bold font-[var(--font-outfit)]">{card.value}</p>
            <p className="text-[11px] opacity-70">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      {city.description && (
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary mb-2">About {city.name}</h2>
          <p className="text-text-secondary leading-relaxed">{city.description}</p>
        </div>
      )}

      {/* Activities */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">
          Things to Do in {city.name} 🎯
        </h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterType("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterType ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border hover:text-primary"}`}>
            All
          </button>
          {types.map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border hover:text-primary"}`}>
              {typeEmoji[t] || ""} {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-10 text-text-muted">No activities match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((act, i) => (
            <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${typeColors[act.type] || "bg-gray-500"} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                  {typeEmoji[act.type] || "📍"}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold font-[var(--font-outfit)] text-text-primary">{act.name}</h3>
                  <span className="text-xs text-text-muted flex items-center gap-1"><Tag className="w-3 h-3" />{act.type.charAt(0) + act.type.slice(1).toLowerCase()}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-bold ${act.cost === 0 ? "text-emerald-500" : "text-text-primary"}`}>
                    {act.cost === 0 ? "Free" : `$${act.cost}`}
                  </p>
                  <p className="text-xs text-text-muted flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{act.duration}h</p>
                </div>
              </div>
              {act.description && <p className="text-sm text-text-secondary leading-relaxed">{act.description}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
