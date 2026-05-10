"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Plus, MapPin, Calendar, Clock, DollarSign, Save,
  ChevronLeft, ChevronRight, Trash2, Loader2, Sparkles, X,
} from "lucide-react";

interface Activity {
  id: string; name: string; type: string; cost: number;
  duration: number; description: string | null;
}
interface StopActivity {
  id: string; activity: Activity; date: string;
  estimatedCost: number | null; startTime: string | null;
  endTime: string | null; notes: string | null;
}
interface Stop {
  id: string; city: { id: string; name: string; country: string };
  arrivalDate: string; departureDate: string; order: number;
  notes: string | null; activities: StopActivity[];
}
interface Trip {
  id: string; name: string; description: string | null;
  startDate: string; endDate: string; budget: number | null;
  status: string; stops: Stop[];
}

const typeColors: Record<string, string> = {
  SIGHTSEEING: "bg-blue-500", FOOD: "bg-amber-500", ADVENTURE: "bg-red-500",
  CULTURE: "bg-violet-500", NATURE: "bg-emerald-500", SHOPPING: "bg-pink-500",
};
const typeEmoji: Record<string, string> = {
  SIGHTSEEING: "👁️", FOOD: "🍽️", ADVENTURE: "🏔️",
  CULTURE: "🏛️", NATURE: "🌿", SHOPPING: "🛍️",
};

function getDaysBetween(start: string, end: string): string[] {
  const days: string[] = [];
  const d = new Date(start);
  const last = new Date(end);
  while (d <= last) {
    days.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDay(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

export default function ItineraryBuilderPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  // Activity search panel
  const [showSearch, setShowSearch] = useState(false);
  const [searchCity, setSearchCity] = useState<string | null>(null);
  const [searchStopId, setSearchStopId] = useState<string | null>(null);
  const [actSearch, setActSearch] = useState("");
  const [actResults, setActResults] = useState<Activity[]>([]);

  const refreshTrip = async () => {
    const r = await fetch(`/api/trips/${tripId}`);
    const d = await r.json();
    if (d.trip) setTrip(d.trip);
  };

  useEffect(() => {
    refreshTrip().then(() => setLoading(false));
  }, [tripId]);

  // All days of the trip
  const days = useMemo(() => {
    if (!trip) return [];
    return getDaysBetween(trip.startDate, trip.endDate);
  }, [trip]);

  // Map each day → which stop(city) the user is in + activities for that day
  const dayData = useMemo(() => {
    if (!trip) return [];
    return days.map((dayStr) => {
      const stop = trip.stops.find((s) => {
        const arr = new Date(s.arrivalDate).toISOString().split("T")[0];
        const dep = new Date(s.departureDate).toISOString().split("T")[0];
        return dayStr >= arr && dayStr <= dep;
      });
      const dayActivities = stop
        ? stop.activities.filter((sa) => {
            const saDate = new Date(sa.date).toISOString().split("T")[0];
            return saDate === dayStr;
          })
        : [];
      const dayCost = dayActivities.reduce(
        (s, a) => s + (a.estimatedCost ?? a.activity.cost ?? 0), 0
      );
      return { dayStr, stop, activities: dayActivities, cost: dayCost };
    });
  }, [trip, days]);

  // Totals
  const totalCost = dayData.reduce((s, d) => s + d.cost, 0);

  // Search activities for a city
  useEffect(() => {
    if (showSearch && searchCity && actSearch.length >= 0) {
      fetch(`/api/activities?cityId=${searchCity}&search=${actSearch}`)
        .then((r) => r.json())
        .then((d) => setActResults(d.activities || []));
    }
  }, [actSearch, searchCity, showSearch]);

  const openSearch = (cityId: string, stopId: string) => {
    setSearchCity(cityId);
    setSearchStopId(stopId);
    setShowSearch(true);
    setActSearch("");
    // Pre-fetch all activities for this city
    fetch(`/api/activities?cityId=${cityId}`)
      .then((r) => r.json())
      .then((d) => setActResults(d.activities || []));
  };

  const addActivity = async (activity: Activity) => {
    if (!searchStopId) return;
    const dayStr = days[activeDay];
    await fetch(`/api/trips/${tripId}/stops/${searchStopId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityId: activity.id,
        date: dayStr,
        estimatedCost: activity.cost,
      }),
    });
    await refreshTrip();
  };

  const removeActivity = async (stopId: string, saId: string) => {
    await fetch(`/api/trips/${tripId}/stops/${stopId}/activities/${saId}`, {
      method: "DELETE",
    });
    await refreshTrip();
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!trip) return <div className="text-center py-20"><p className="text-text-secondary">Trip not found.</p><Link href="/dashboard" className="text-primary mt-4 inline-block">Go to Dashboard</Link></div>;

  const currentDay = dayData[activeDay];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to My Trips
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">{trip.name}</h1>
          <p className="text-text-secondary mt-1">{days.length} days · {trip.stops.length} cities</p>
        </motion.div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/trips/${tripId}/notes`}
            className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary font-medium rounded-xl hover:text-primary hover:border-primary/30 transition-all text-sm">
            📓 Journal
          </Link>
          <Link href={`/trips/${tripId}/packing`}
            className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary font-medium rounded-xl hover:text-primary hover:border-primary/30 transition-all text-sm">
            🧳 Packing
          </Link>
          <Link href={`/trips/${tripId}/expenses`}
            className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary font-medium rounded-xl hover:text-primary hover:border-primary/30 transition-all text-sm">
            💰 Expenses
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>

      {/* Budget overview */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Budget Overview
          </h3>
          <span className={`text-sm font-bold ${trip.budget && totalCost > trip.budget ? "text-red-500" : "text-text-primary"}`}>
            ${totalCost.toLocaleString()}{trip.budget ? ` / $${trip.budget.toLocaleString()}` : " total"}
          </span>
        </div>
        {trip.budget && (
          <div className="w-full h-3 rounded-full bg-surface-elevated overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${totalCost > trip.budget ? "bg-gradient-to-r from-red-400 to-red-500" : "bg-gradient-to-r from-primary to-primary-light"}`}
              style={{ width: `${Math.min((totalCost / trip.budget) * 100, 100)}%` }} />
          </div>
        )}
        <div className="flex gap-4 mt-3 text-xs text-text-muted">
          {trip.budget && <span>Remaining: ${Math.max(trip.budget - totalCost, 0).toLocaleString()}</span>}
          <span>Avg/day: ${days.length ? Math.round(totalCost / days.length) : 0}</span>
        </div>
      </div>

      {/* Day selector strip */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setActiveDay(Math.max(0, activeDay - 1))} disabled={activeDay === 0}
          className="p-2 rounded-xl border border-border text-text-muted hover:text-primary disabled:opacity-30 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 min-w-max px-1">
            {days.map((d, i) => {
              const dd = dayData[i];
              return (
                <button key={d} onClick={() => setActiveDay(i)}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-xl text-xs font-medium transition-all min-w-[80px] ${
                    activeDay === i
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : dd.stop
                      ? "bg-surface-elevated text-text-secondary border border-border hover:border-primary/30"
                      : "bg-surface text-text-muted border border-dashed border-border"
                  }`}>
                  <span className="font-bold">Day {i + 1}</span>
                  <span className="mt-0.5 opacity-80">{formatDay(d)}</span>
                  {dd.activities.length > 0 && (
                    <span className={`mt-1 text-[10px] ${activeDay === i ? "text-white/80" : "text-primary"}`}>
                      {dd.activities.length} act · ${dd.cost}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={() => setActiveDay(Math.min(days.length - 1, activeDay + 1))} disabled={activeDay === days.length - 1}
          className="p-2 rounded-xl border border-border text-text-muted hover:text-primary disabled:opacity-30 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day content */}
      {currentDay && (
        <motion.div key={activeDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          {/* Day header */}
          <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-[var(--font-outfit)] text-text-primary">
                  Day {activeDay + 1} — {formatDay(currentDay.dayStr)}
                </h2>
                {currentDay.stop ? (
                  <p className="text-sm text-text-secondary mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {currentDay.stop.city.name}, {currentDay.stop.city.country}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted mt-1">No city assigned for this day</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">${currentDay.cost}</p>
                <p className="text-xs text-text-muted">day cost</p>
              </div>
            </div>
          </div>

          {/* Activities for this day */}
          <div className="space-y-3 mb-4">
            {currentDay.activities.length > 0 ? (
              currentDay.activities.map((sa, idx) => (
                <div key={sa.id} className="flex items-stretch gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center w-8 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg ${typeColors[sa.activity.type] || "bg-gray-500"} flex items-center justify-center text-white text-sm`}>
                      {typeEmoji[sa.activity.type] || "📍"}
                    </div>
                    {idx < currentDay.activities.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    )}
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-surface border border-border rounded-xl p-4 hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary">{sa.activity.name}</h4>
                        {sa.activity.description && (
                          <p className="text-xs text-text-muted mt-1 line-clamp-1">{sa.activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{sa.activity.duration}h</span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary text-[10px] font-medium">
                            {sa.activity.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className={`text-lg font-bold ${(sa.estimatedCost ?? sa.activity.cost) === 0 ? "text-emerald-500" : "text-text-primary"}`}>
                          {(sa.estimatedCost ?? sa.activity.cost) === 0 ? "Free" : `$${sa.estimatedCost ?? sa.activity.cost}`}
                        </p>
                        {currentDay.stop && (
                          <button onClick={() => removeActivity(currentDay.stop!.id, sa.id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-surface border border-dashed border-border rounded-2xl">
                <Calendar className="w-10 h-10 mx-auto text-text-muted mb-3" />
                <p className="text-text-muted text-sm">No activities planned for this day</p>
              </div>
            )}
          </div>

          {/* Add activity button */}
          {currentDay.stop && (
            <button onClick={() => openSearch(currentDay.stop!.city.id, currentDay.stop!.id)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors">
              <Plus className="w-4 h-4" /> Add Activity for Day {activeDay + 1}
            </button>
          )}

          {/* Day cost summary */}
          {currentDay.activities.length > 0 && (
            <div className="mt-4 bg-surface-elevated rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Day {activeDay + 1} Total</span>
                <span className="font-bold text-text-primary">${currentDay.cost}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-text-muted">Running Total (all days)</span>
                <span className="font-bold text-text-primary">${totalCost.toLocaleString()}</span>
              </div>
              {trip.budget && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-text-muted">Budget Remaining</span>
                  <span className={`font-bold ${trip.budget - totalCost < 0 ? "text-red-500" : "text-emerald-500"}`}>
                    ${Math.max(trip.budget - totalCost, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Activity Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg mx-4 bg-surface border border-border rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Add Activity
              </h3>
              <button onClick={() => setShowSearch(false)} className="p-2 rounded-xl text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 border-b border-border">
              <input type="text" value={actSearch} onChange={(e) => setActSearch(e.target.value)} placeholder="Search activities..."
                autoFocus className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {actResults.length === 0 ? (
                <p className="text-center py-6 text-text-muted text-sm">No activities found</p>
              ) : (
                actResults.map((act) => (
                  <button key={act.id} onClick={() => addActivity(act)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 transition-all text-left">
                    <div className={`w-9 h-9 rounded-lg ${typeColors[act.type] || "bg-gray-500"} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                      {typeEmoji[act.type] || "📍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary text-sm">{act.name}</p>
                      <p className="text-xs text-text-muted flex items-center gap-2">
                        <span>{act.type}</span> · <span>{act.duration}h</span>
                      </p>
                    </div>
                    <p className={`text-sm font-bold flex-shrink-0 ${act.cost === 0 ? "text-emerald-500" : "text-text-primary"}`}>
                      {act.cost === 0 ? "Free" : `$${act.cost}`}
                    </p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
