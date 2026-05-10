"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: number;
}

export default function NewTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Trip basics
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // City suggestions
  const [cities, setCities] = useState<City[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  useEffect(() => {
    if (citySearch.length >= 1) {
      fetch(`/api/cities?search=${citySearch}`)
        .then((r) => r.json())
        .then((d) => setCities(d.cities || []));
    } else {
      setCities([]);
    }
  }, [citySearch]);

  const handleSubmit = async () => {
    if (!name || !startDate || !endDate) {
      setError("Trip name, start date, and end date are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          startDate,
          endDate,
          budget: budget || null,
          isPublic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create trip");
        setLoading(false);
        return;
      }

      // If cities selected, add them as stops
      if (selectedCities.length > 0) {
        for (let i = 0; i < selectedCities.length; i++) {
          await fetch(`/api/trips/${data.trip.id}/stops`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cityId: selectedCities[i].id,
              arrivalDate: startDate,
              departureDate: endDate,
              order: i,
            }),
          });
        }
      }

      router.push(`/trips/${data.trip.id}/itinerary`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">
          Create a New Trip ✈️
        </h1>
        <p className="mt-2 text-text-secondary">
          Fill in the details to start planning your adventure
        </p>
      </motion.div>

      {/* Step indicators */}
      <div className="flex items-center gap-4 mb-10">
        {[
          { n: 1, label: "Basics" },
          { n: 2, label: "Destinations" },
          { n: 3, label: "Review" },
        ].map((s) => (
          <button
            key={s.n}
            onClick={() => s.n < step && setStep(s.n)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step === s.n
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : step > s.n
                ? "bg-primary/10 text-primary"
                : "bg-surface-elevated text-text-muted border border-border"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {s.n}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Basics */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <FileText className="w-4 h-4 text-primary" /> Trip Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer in Europe"
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <FileText className="w-4 h-4 text-primary" /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your trip..."
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <Calendar className="w-4 h-4 text-primary" /> Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <Calendar className="w-4 h-4 text-accent" /> End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <DollarSign className="w-4 h-4 text-primary" /> Budget (USD)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 5000"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-7 rounded-full transition-colors duration-200 ${
                isPublic ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-sm text-text-secondary">
              <Globe className="w-4 h-4 inline mr-1" />
              Make this trip public
            </label>
          </div>

          <button
            onClick={() => {
              if (!name || !startDate || !endDate) {
                setError("Please fill in all required fields");
                return;
              }
              setError("");
              setStep(2);
            }}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
          >
            Next: Add Destinations →
          </button>
        </motion.div>
      )}

      {/* Step 2: Destinations */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <MapPin className="w-4 h-4 text-primary" /> Search Cities
            </label>
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search for a city..."
              className={inputClass}
            />
          </div>

          {/* City results */}
          {cities.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cities
                .filter((c) => !selectedCities.find((sc) => sc.id === c.id))
                .map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCities([...selectedCities, city]);
                      setCitySearch("");
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 transition-all text-left"
                  >
                    <div>
                      <span className="font-medium text-text-primary">
                        {city.name}
                      </span>
                      <span className="text-text-muted ml-2 text-sm">
                        {city.country}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted px-2 py-1 bg-surface rounded-lg">
                      {city.region}
                    </span>
                  </button>
                ))}
            </div>
          )}

          {/* Selected cities */}
          {selectedCities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">
                Selected Destinations ({selectedCities.length})
              </h3>
              {selectedCities.map((city, i) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-medium text-text-primary">
                        {city.name}
                      </span>
                      <span className="text-text-muted ml-2 text-sm">
                        {city.country}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedCities(
                        selectedCities.filter((c) => c.id !== city.id)
                      )
                    }
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 border border-border text-text-secondary font-medium rounded-xl hover:bg-surface-elevated transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
            >
              Next: Review →
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold font-[var(--font-outfit)] text-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Trip Summary
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Trip Name</span>
                <p className="font-medium text-text-primary mt-1">{name}</p>
              </div>
              <div>
                <span className="text-text-muted">Budget</span>
                <p className="font-medium text-text-primary mt-1">
                  {budget ? `$${Number(budget).toLocaleString()}` : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-text-muted">Start Date</span>
                <p className="font-medium text-text-primary mt-1">
                  {startDate}
                </p>
              </div>
              <div>
                <span className="text-text-muted">End Date</span>
                <p className="font-medium text-text-primary mt-1">{endDate}</p>
              </div>
            </div>

            {description && (
              <div className="text-sm">
                <span className="text-text-muted">Description</span>
                <p className="font-medium text-text-primary mt-1">
                  {description}
                </p>
              </div>
            )}

            {selectedCities.length > 0 && (
              <div className="text-sm">
                <span className="text-text-muted">Destinations</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCities.map((city) => (
                    <span
                      key={city.id}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium"
                    >
                      {city.name}, {city.country}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm">
              <span className="text-text-muted">Visibility</span>
              <p className="font-medium text-text-primary mt-1">
                {isPublic ? "🌐 Public" : "🔒 Private"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3.5 border border-border text-text-secondary font-medium rounded-xl hover:bg-surface-elevated transition-all"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
              ) : (
                "🚀 Create Trip"
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
