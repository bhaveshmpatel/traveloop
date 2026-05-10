"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Plus, Search, SlidersHorizontal, ArrowUpDown, X,
  MapPin, Calendar, FileText, Trash2, Loader2, BookOpen,
} from "lucide-react";

interface Note {
  id: string; title: string; content: string;
  dayNumber: number | null; createdAt: string;
  stop: { id: string; city: { name: string; country: string } } | null;
}
interface Stop { id: string; city: { name: string } }

type ViewMode = "all" | "byDay" | "byStop";
type SortMode = "newest" | "oldest" | "day";

export default function NotesPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [notes, setNotes] = useState<Note[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // Add note form
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newStopId, setNewStopId] = useState("");
  const [newDay, setNewDay] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    const [notesRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${tripId}/notes`).then((r) => r.json()),
      fetch(`/api/trips/${tripId}`).then((r) => r.json()),
    ]);
    setNotes(notesRes.notes || []);
    setStops(tripRes.trip?.stops || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [tripId]);

  const addNote = async () => {
    if (!newContent.trim()) return;
    setSaving(true);
    await fetch(`/api/trips/${tripId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle, content: newContent,
        stopId: newStopId || null, dayNumber: newDay ? parseInt(newDay) : null,
      }),
    });
    setNewTitle(""); setNewContent(""); setNewStopId(""); setNewDay("");
    setShowAdd(false); setSaving(false);
    fetchNotes();
  };

  const deleteNote = async (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
    await fetch(`/api/trips/${tripId}/notes?noteId=${noteId}`, { method: "DELETE" });
  };

  const filtered = useMemo(() => {
    let result = notes;
    if (search) result = result.filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    );
    if (sortMode === "oldest") result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sortMode === "day") result = [...result].sort((a, b) => (a.dayNumber || 99) - (b.dayNumber || 99));
    else result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [notes, search, sortMode]);

  const grouped = useMemo(() => {
    if (viewMode === "byDay") {
      const groups: Record<string, Note[]> = {};
      for (const n of filtered) {
        const key = n.dayNumber ? `Day ${n.dayNumber}` : "General";
        if (!groups[key]) groups[key] = [];
        groups[key].push(n);
      }
      return groups;
    }
    if (viewMode === "byStop") {
      const groups: Record<string, Note[]> = {};
      for (const n of filtered) {
        const key = n.stop ? `${n.stop.city.name}, ${n.stop.city.country}` : "General";
        if (!groups[key]) groups[key] = [];
        groups[key].push(n);
      }
      return groups;
    }
    return { "All Notes": filtered };
  }, [filtered, viewMode]);

  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return "just now"; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const inputClass = "w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link href={`/trips/${tripId}/itinerary`} className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Itinerary
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Trip Journal 📓</h1>
        <p className="mt-1 text-text-secondary">Capture memories, notes, and thoughts from your trip</p>
      </motion.div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all text-sm">
          <Plus className="w-4 h-4" /> Add Note
        </button>
        <div className="flex-1" />
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-text-secondary"}`}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..."
                  className="w-full pl-11 pr-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-text-muted pt-1.5">Group:</span>
                {(["all", "byDay", "byStop"] as ViewMode[]).map((v) => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === v ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border"}`}>
                    {v === "all" ? "All" : v === "byDay" ? "By Day" : "By Stop"}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <ArrowUpDown className="w-4 h-4 text-text-muted mt-1" />
                {(["newest", "oldest", "day"] as SortMode[]).map((s) => (
                  <button key={s} onClick={() => setSortMode(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortMode === s ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border"}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add note form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-[var(--font-outfit)] text-text-primary flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> New Note</h3>
                <button onClick={() => setShowAdd(false)} className="p-1 text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
              </div>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Note title (optional)" className={inputClass} />
              <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your note..." rows={4} className={inputClass + " resize-none"} />
              <div className="grid grid-cols-2 gap-3">
                <select value={newStopId} onChange={(e) => setNewStopId(e.target.value)} className={inputClass + " appearance-none cursor-pointer"}>
                  <option value="">No specific stop</option>
                  {stops.map((s) => <option key={s.id} value={s.id}>{s.city.name}</option>)}
                </select>
                <input type="number" value={newDay} onChange={(e) => setNewDay(e.target.value)} placeholder="Day number (optional)" min={1} className={inputClass} />
              </div>
              <button onClick={addNote} disabled={saving || !newContent.trim()}
                className="w-full py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Note"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      {Object.keys(grouped).length === 0 || filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No notes yet</h3>
          <p className="text-text-secondary text-sm">Start journaling your trip!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, groupNotes]) => (
            <div key={group}>
              {viewMode !== "all" && (
                <h2 className="text-lg font-bold font-[var(--font-outfit)] text-text-primary mb-3 flex items-center gap-2">
                  {viewMode === "byStop" ? <MapPin className="w-4 h-4 text-primary" /> : <Calendar className="w-4 h-4 text-primary" />}
                  {group} <span className="text-sm font-normal text-text-muted">({groupNotes.length})</span>
                </h2>
              )}
              <div className="space-y-3">
                {groupNotes.map((note) => (
                  <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        {note.title && <h3 className="font-bold text-text-primary mb-1">{note.title}</h3>}
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>{timeAgo(note.createdAt)}</span>
                          {note.dayNumber && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Day {note.dayNumber}</span>}
                          {note.stop && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{note.stop.city.name}</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
