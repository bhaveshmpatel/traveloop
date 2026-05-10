"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Map,
  DollarSign,
  Edit3,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  photoUrl: string | null;
  createdAt: string;
}

interface Trip {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number | null;
  stops: { city: { name: string } }[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/trips").then((r) => r.json()),
    ]).then(([userData, tripsData]) => {
      if (userData.user) {
        setUser(userData.user);
        setFirstName(userData.user.firstName);
        setLastName(userData.user.lastName);
        setPhone(userData.user.phone || "");
        setCity(userData.user.city || "");
        setCountry(userData.user.country || "");
      }
      setTrips(tripsData.trips || []);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, phone, city, country }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setEditing(false);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const plannedTrips = trips.filter((t) => t.status === "PLANNING");
  const completedTrips = trips.filter((t) => t.status === "COMPLETED");
  const countriesVisited = new Set(completedTrips.flatMap((t) => t.stops.map(() => "1"))).size;
  const totalSpent = completedTrips.reduce((s, t) => s + (t.budget || 0), 0);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const inputClass =
    "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-primary/20">
            {user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "?"}
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                {editing ? (
                  <div className="flex gap-3">
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First" className={inputClass + " max-w-[150px]"} />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last" className={inputClass + " max-w-[150px]"} />
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary">
                    {user?.firstName} {user?.lastName}
                  </h1>
                )}
              </div>
              <button onClick={() => editing ? handleSave() : setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {editing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Mail className="w-4 h-4 text-text-muted" />{user?.email}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="w-4 h-4 text-text-muted" />
                {editing ? <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="Phone" /> : user?.phone || "Not set"}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-4 h-4 text-text-muted" />
                {editing ? <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="City" /> : user?.city || "Not set"}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Globe className="w-4 h-4 text-text-muted" />
                {editing ? <input value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="Country" /> : user?.country || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Map, label: "Total Trips", value: trips.length, color: "from-primary to-primary-light" },
          { icon: Globe, label: "Destinations", value: countriesVisited, color: "from-blue-500 to-indigo-500" },
          { icon: DollarSign, label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, color: "from-emerald-500 to-teal-500" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white`}>
            <stat.icon className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold font-[var(--font-outfit)]">{stat.value}</p>
            <p className="text-xs opacity-70 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pre-planned trips */}
      <section className="mb-8">
        <h2 className="text-xl font-bold font-[var(--font-outfit)] text-text-primary mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Pre-planned Trips
        </h2>
        {plannedTrips.length === 0 ? (
          <p className="text-sm text-text-muted">No planned trips yet</p>
        ) : (
          <div className="space-y-3">
            {plannedTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}/itinerary`}
                className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary/20 transition-all">
                <div>
                  <h3 className="font-medium text-text-primary">{trip.name}</h3>
                  <p className="text-sm text-text-muted">{formatDate(trip.startDate)} → {formatDate(trip.endDate)}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">Planning</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Previous trips */}
      <section>
        <h2 className="text-xl font-bold font-[var(--font-outfit)] text-text-primary mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Previous Trips
        </h2>
        {completedTrips.length === 0 ? (
          <p className="text-sm text-text-muted">No completed trips yet</p>
        ) : (
          <div className="space-y-3">
            {completedTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}/itinerary`}
                className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary/20 transition-all">
                <div>
                  <h3 className="font-medium text-text-primary">{trip.name}</h3>
                  <p className="text-sm text-text-muted">{formatDate(trip.startDate)} → {formatDate(trip.endDate)}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">Completed</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
