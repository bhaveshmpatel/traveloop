"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Globe, Star, MapPin, Filter, Loader2 } from "lucide-react";

interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: number;
  popularity: number;
  description: string | null;
  imageUrl: string | null;
}

const regionsList = ["All", "Asia", "Europe", "Americas", "Africa", "Oceania", "Middle East"];

function CitiesContent() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get("region") || "";
  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (region) params.set("region", region);
    fetch(`/api/cities?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { setCities(d.cities || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, region]);

  const costLabel = (idx: number) => {
    if (idx <= 1) return "💰 Budget";
    if (idx <= 2) return "💰💰 Affordable";
    if (idx <= 3) return "💰💰💰 Moderate";
    if (idx <= 4) return "💰💰💰💰 Pricey";
    return "💰💰💰💰💰 Luxury";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Explore Cities 🌍</h1>
        <p className="mt-2 text-text-secondary">Discover destinations from around the world</p>
      </motion.div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cities or countries..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select value={region} onChange={(e) => setRegion(e.target.value === "All" ? "" : e.target.value)}
            className="pl-10 pr-8 py-3 bg-surface border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer">
            {regionsList.map((r) => <option key={r} value={r === "All" ? "" : r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* City cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-surface-elevated rounded-2xl animate-pulse" />)}
        </div>
      ) : cities.length === 0 ? (
        <div className="text-center py-20"><Globe className="w-16 h-16 mx-auto text-text-muted mb-4" /><p className="text-text-secondary">No cities found. Try a different search.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <motion.div key={city.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={`/explore/cities/${city.id}`}
              className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-44 bg-gradient-to-br from-primary/20 to-accent/20">
                {city.imageUrl && (
                  <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {city.popularity}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-sm text-text-muted mb-1">
                  <MapPin className="w-3.5 h-3.5" />{city.country}
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{city.region}</span>
                </div>
                <h3 className="text-xl font-bold font-[var(--font-outfit)] text-text-primary group-hover:text-primary transition-colors">{city.name}</h3>
                {city.description && <p className="mt-2 text-sm text-text-secondary line-clamp-2">{city.description}</p>}
                <div className="mt-3 text-xs text-text-muted">{costLabel(city.costIndex)}</div>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CitiesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <CitiesContent />
    </Suspense>
  );
}
