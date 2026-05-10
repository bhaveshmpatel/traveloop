"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Check, Plus, RotateCcw, Share2, Search,
  SlidersHorizontal, ArrowUpDown, Loader2, X, FileText,
  Shirt, Laptop, ShowerHead, Package, Trash2, CheckCircle2,
} from "lucide-react";

interface PackingItem {
  id: string; name: string; category: string; isPacked: boolean;
}

const CATEGORIES = ["DOCUMENTS", "CLOTHING", "ELECTRONICS", "TOILETRIES", "OTHER"] as const;

const categoryMeta: Record<string, { icon: typeof FileText; color: string; label: string; emoji: string }> = {
  DOCUMENTS: { icon: FileText, color: "from-blue-500 to-indigo-500", label: "Documents", emoji: "📄" },
  CLOTHING: { icon: Shirt, color: "from-violet-500 to-purple-500", label: "Clothing", emoji: "👕" },
  ELECTRONICS: { icon: Laptop, color: "from-amber-500 to-orange-500", label: "Electronics", emoji: "🔌" },
  TOILETRIES: { icon: ShowerHead, color: "from-emerald-500 to-teal-500", label: "Toiletries", emoji: "🧴" },
  OTHER: { icon: Package, color: "from-gray-500 to-slate-500", label: "Other", emoji: "📦" },
};

const defaultItems: Record<string, string[]> = {
  DOCUMENTS: ["Passport", "Flight tickets", "Travel insurance", "Hotel booking confirmation", "Visa documents", "ID card", "Emergency contacts list"],
  CLOTHING: ["Casual shirts", "Trousers/jeans", "Light jacket", "Underwear", "Socks", "Sleepwear", "Comfortable walking shoes", "Formal outfit", "Swimwear", "Sunglasses"],
  ELECTRONICS: ["Phone charger", "Universal power adapter", "Earphones/headphones", "Power bank", "Camera", "Laptop/tablet"],
  TOILETRIES: ["Toothbrush & toothpaste", "Shampoo & conditioner", "Sunscreen", "Deodorant", "Medications", "First-aid kit", "Hand sanitizer"],
  OTHER: ["Daypack/backpack", "Water bottle", "Snacks", "Travel pillow", "Umbrella", "Pen & notebook"],
};

export default function PackingPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "category" | "status">("category");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<string>("OTHER");

  const fetchItems = async () => {
    const r = await fetch(`/api/trips/${tripId}/packing`);
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [tripId]);

  // Auto-populate defaults if empty
  useEffect(() => {
    if (!loading && items.length === 0) {
      const allItems = Object.entries(defaultItems).flatMap(([cat, names]) =>
        names.map((name) => ({ name, category: cat }))
      );
      fetch(`/api/trips/${tripId}/packing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: allItems }),
      }).then(() => fetchItems());
    }
  }, [loading, items.length]);

  const toggleItem = async (item: PackingItem) => {
    setItems(items.map((i) => i.id === item.id ? { ...i, isPacked: !i.isPacked } : i));
    await fetch(`/api/trips/${tripId}/packing`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, isPacked: !item.isPacked }),
    });
  };

  const addItem = async () => {
    if (!newName.trim()) return;
    await fetch(`/api/trips/${tripId}/packing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), category: newCategory }),
    });
    setNewName("");
    setShowAddForm(false);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await fetch(`/api/trips/${tripId}/packing?itemId=${id}`, { method: "DELETE" });
  };

  const resetAll = async () => {
    if (!confirm("Reset all items to unpacked?")) return;
    setItems(items.map((i) => ({ ...i, isPacked: false })));
    await fetch(`/api/trips/${tripId}/packing`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetAll: true }),
    });
  };

  const shareChecklist = () => {
    const text = Object.entries(grouped).map(([cat, catItems]) => {
      const meta = categoryMeta[cat];
      return `${meta?.emoji || "📦"} ${meta?.label || cat}\n${catItems.map((i) => `${i.isPacked ? "✅" : "⬜"} ${i.name}`).join("\n")}`;
    }).join("\n\n");
    if (navigator.share) {
      navigator.share({ title: "Packing Checklist", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Checklist copied to clipboard!");
    }
  };

  // Filtering & sorting
  const filtered = useMemo(() => {
    let result = items;
    if (search) result = result.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    if (filterCategory) result = result.filter((i) => i.category === filterCategory);
    if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "status") result = [...result].sort((a, b) => Number(a.isPacked) - Number(b.isPacked));
    else result = [...result].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    return result;
  }, [items, search, filterCategory, sortBy]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, PackingItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  const totalPacked = items.filter((i) => i.isPacked).length;
  const progress = items.length ? Math.round((totalPacked / items.length) * 100) : 0;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link href={`/trips/${tripId}/itinerary`} className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Itinerary
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Packing Checklist 🧳</h1>
        <p className="mt-1 text-text-secondary">Never forget an essential again</p>
      </motion.div>

      {/* Progress bar */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">{totalPacked} / {items.length} packed</span>
          <span className={`text-sm font-bold ${progress === 100 ? "text-emerald-500" : "text-primary"}`}>{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-surface-elevated overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" initial={{ width: 0 }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        {progress === 100 && (
          <p className="text-sm text-emerald-500 font-medium mt-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> All packed! You&apos;re ready to go! 🎉</p>
        )}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all text-sm">
          <Plus className="w-4 h-4" /> Add Item
        </button>
        <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary rounded-xl hover:text-primary hover:border-primary/30 transition-all text-sm">
          <RotateCcw className="w-4 h-4" /> Reset All
        </button>
        <button onClick={shareChecklist} className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary rounded-xl hover:text-primary hover:border-primary/30 transition-all text-sm">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <div className="flex-1" />
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-text-secondary hover:text-primary"}`}>
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
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..."
                  className="w-full pl-11 pr-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilterCategory("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterCategory ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border"}`}>All</button>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCategory === cat ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border"}`}>
                    {categoryMeta[cat].emoji} {categoryMeta[cat].label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-text-muted" />
                {(["category", "name", "status"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === s ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary border border-border"}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add item form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-surface border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">Add New Item</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-3">
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Item name..."
                  onKeyDown={(e) => e.key === "Enter" && addItem()} autoFocus
                  className="flex-1 px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3 py-2.5 bg-surface-elevated border border-border rounded-xl text-text-primary text-sm focus:outline-none appearance-none cursor-pointer">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{categoryMeta[c].label}</option>)}
                </select>
                <button onClick={addItem} className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors">Add</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist grouped by category */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, catItems]) => {
          const meta = categoryMeta[cat] || categoryMeta.OTHER;
          const catPacked = catItems.filter((i) => i.isPacked).length;
          return (
            <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Category header */}
              <div className={`bg-gradient-to-r ${meta.color} px-5 py-3.5 flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-lg">{meta.emoji}</span>
                  <h3 className="font-bold font-[var(--font-outfit)]">{meta.label}</h3>
                </div>
                <span className="text-white/80 text-sm font-medium">{catPacked}/{catItems.length}</span>
              </div>
              {/* Items */}
              <div className="divide-y divide-border">
                {catItems.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 px-5 py-3 transition-colors ${item.isPacked ? "bg-surface-elevated/50" : "hover:bg-surface-elevated/30"}`}>
                    <button onClick={() => toggleItem(item)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        item.isPacked ? "bg-primary border-primary text-white" : "border-border hover:border-primary/50"
                      }`}>
                      {item.isPacked && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`flex-1 text-sm transition-all ${item.isPacked ? "line-through text-text-muted" : "text-text-primary"}`}>
                      {item.name}
                    </span>
                    <button onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      style={{ opacity: 1 }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary">No items match your filter.</p>
        </div>
      )}
    </div>
  );
}
