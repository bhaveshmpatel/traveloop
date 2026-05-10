"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Save,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
} from "lucide-react";

interface Activity {
  id: string;
  name: string;
  type: string;
  cost: number;
  duration: number;
}

interface StopActivity {
  id: string;
  activity: Activity;
  estimatedCost: number | null;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
}

interface Stop {
  id: string;
  city: { id: string; name: string; country: string };
  arrivalDate: string;
  departureDate: string;
  order: number;
  notes: string | null;
  activities: StopActivity[];
}

interface Trip {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  budget: number | null;
  status: string;
  stops: Stop[];
}

export default function ItineraryBuilderPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Activity search
  const [searchingStop, setSearchingStop] = useState<string | null>(null);
  const [activityResults, setActivityResults] = useState<Activity[]>([]);
  const [actSearch, setActSearch] = useState("");

  useEffect(() => {
    fetch(`/api/trips/${tripId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.trip) {
          setTrip(d.trip);
          setExpandedStops(new Set(d.trip.stops.map((s: Stop) => s.id)));
        }
        setLoading(false);
      });
  }, [tripId]);

  useEffect(() => {
    if (searchingStop && actSearch.length >= 1) {
      const stop = trip?.stops.find((s) => s.id === searchingStop);
      if (stop) {
        fetch(
          `/api/activities?cityId=${stop.city.id}&search=${actSearch}`
        )
          .then((r) => r.json())
          .then((d) => setActivityResults(d.activities || []));
      }
    } else {
      setActivityResults([]);
    }
  }, [actSearch, searchingStop, trip]);

  const toggleStop = (id: string) => {
    const next = new Set(expandedStops);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedStops(next);
  };

  const addActivityToStop = async (stopId: string, activity: Activity) => {
    const res = await fetch(
      `/api/trips/${tripId}/stops/${stopId}/activities`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: activity.id,
          date: new Date().toISOString(),
          estimatedCost: activity.cost,
        }),
      }
    );
    if (res.ok) {
      // Refresh trip data
      const r = await fetch(`/api/trips/${tripId}`);
      const d = await r.json();
      if (d.trip) setTrip(d.trip);
      setSearchingStop(null);
      setActSearch("");
    }
  };

  const totalCost = trip?.stops.reduce(
    (sum, stop) =>
      sum +
      stop.activities.reduce(
        (s, a) => s + (a.estimatedCost || a.activity.cost || 0),
        0
      ),
    0
  ) || 0;

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Trip not found.</p>
        <Link href="/dashboard" className="text-primary mt-4 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <Link
        href="/trips"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Trips
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">
            {trip.name}
          </h1>
          <p className="text-text-secondary mt-1">
            {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
          </p>
        </motion.div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>
      </div>

      {/* Budget bar */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Budget Overview
          </h3>
          <span className="text-sm text-text-muted">
            ${totalCost.toLocaleString()}{" "}
            {trip.budget ? `/ $${trip.budget.toLocaleString()}` : "spent"}
          </span>
        </div>
        {trip.budget && (
          <div className="w-full h-3 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalCost > trip.budget
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : "bg-gradient-to-r from-primary to-primary-light"
              }`}
              style={{
                width: `${Math.min((totalCost / trip.budget) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Stops / Day-wise sections */}
      {trip.stops.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <MapPin className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">
            No stops added yet
          </h3>
          <p className="text-text-secondary mb-6">
            Add cities to your itinerary to start planning
          </p>
          <Link
            href={`/explore/cities`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <Plus className="w-4 h-4" /> Add Cities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trip.stops.map((stop, i) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-2xl overflow-hidden"
            >
              {/* Stop header */}
              <button
                onClick={() => toggleStop(stop.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-elevated/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold font-[var(--font-outfit)] text-text-primary text-lg">
                      {stop.city.name}
                    </h3>
                    <p className="text-sm text-text-secondary flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(stop.arrivalDate)} →{" "}
                      {formatDate(stop.departureDate)}
                      <span className="text-text-muted">·</span>
                      <span>{stop.activities.length} activities</span>
                    </p>
                  </div>
                </div>
                {expandedStops.has(stop.id) ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>

              {/* Expanded content */}
              {expandedStops.has(stop.id) && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  {/* Activities */}
                  {stop.activities.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {stop.activities.map((sa) => (
                        <div
                          key={sa.id}
                          className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                                sa.activity.type === "FOOD"
                                  ? "bg-amber-500"
                                  : sa.activity.type === "ADVENTURE"
                                  ? "bg-red-500"
                                  : sa.activity.type === "CULTURE"
                                  ? "bg-violet-500"
                                  : sa.activity.type === "NATURE"
                                  ? "bg-emerald-500"
                                  : sa.activity.type === "SHOPPING"
                                  ? "bg-pink-500"
                                  : "bg-blue-500"
                              }`}
                            >
                              {sa.activity.type[0]}
                            </div>
                            <div>
                              <p className="font-medium text-text-primary text-sm">
                                {sa.activity.name}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {sa.activity.duration}h
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />$
                                  {sa.estimatedCost || sa.activity.cost}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 text-text-muted hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted mb-4">
                      No activities added yet
                    </p>
                  )}

                  {/* Add activity */}
                  {searchingStop === stop.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={actSearch}
                        onChange={(e) => setActSearch(e.target.value)}
                        placeholder={`Search activities in ${stop.city.name}...`}
                        autoFocus
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      />
                      {activityResults.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {activityResults.map((act) => (
                            <button
                              key={act.id}
                              onClick={() =>
                                addActivityToStop(stop.id, act)
                              }
                              className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 transition-all text-left"
                            >
                              <div>
                                <span className="font-medium text-text-primary text-sm">
                                  {act.name}
                                </span>
                                <span className="text-text-muted text-xs ml-2">
                                  {act.type}
                                </span>
                              </div>
                              <span className="text-xs text-text-muted">
                                ${act.cost} · {act.duration}h
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setSearchingStop(null);
                          setActSearch("");
                        }}
                        className="text-sm text-text-muted hover:text-text-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSearchingStop(stop.id)}
                      className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Activity
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
