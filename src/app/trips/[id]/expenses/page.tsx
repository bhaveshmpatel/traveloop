"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Plus, Search, ArrowUpDown, X, DollarSign,
  Download, CheckCircle2, Loader2, Receipt, Filter,
  Trash2, FileText, Printer,
} from "lucide-react";

interface Expense {
  id: string; category: string; description: string;
  amount: number; date: string; isPaid: boolean;
}
interface StopActivity {
  id: string; estimatedCost: number | null;
  activity: { name: string; type: string; cost: number };
}
interface Stop {
  id: string; city: { name: string };
  activities: StopActivity[];
}
interface Trip {
  id: string; name: string; startDate: string; endDate: string;
  budget: number | null; status: string;
  stops: Stop[]; expenses: Expense[];
}

const EXPENSE_CATEGORIES = [
  { value: "HOTEL", label: "Hotel", emoji: "🏨", color: "bg-blue-500" },
  { value: "TRAVEL", label: "Travel", emoji: "✈️", color: "bg-indigo-500" },
  { value: "FOOD", label: "Food", emoji: "🍽️", color: "bg-amber-500" },
  { value: "ACTIVITY", label: "Activities", emoji: "🎯", color: "bg-violet-500" },
  { value: "SHOPPING", label: "Shopping", emoji: "🛍️", color: "bg-pink-500" },
  { value: "TRANSPORT", label: "Transport", emoji: "🚕", color: "bg-emerald-500" },
  { value: "OTHER", label: "Other", emoji: "📦", color: "bg-gray-500" },
];

const catMap = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.value, c]));
const TAX_RATE = 0.05;

export default function ExpensePage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [showAdd, setShowAdd] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCat, setNewCat] = useState("OTHER");
  const [saving, setSaving] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    const r = await fetch(`/api/trips/${tripId}/expenses`);
    const d = await r.json();
    if (d.trip) setTrip(d.trip);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [tripId]);

  const addExpense = async () => {
    if (!newDesc || !newAmount) return;
    setSaving(true);
    await fetch(`/api/trips/${tripId}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newDesc, amount: newAmount, category: newCat }),
    });
    setNewDesc(""); setNewAmount(""); setNewCat("OTHER");
    setShowAdd(false); setSaving(false);
    fetchData();
  };

  const togglePaid = async (expenseId: string, isPaid: boolean) => {
    if (!trip) return;
    setTrip({ ...trip, expenses: trip.expenses.map((e) => e.id === expenseId ? { ...e, isPaid } : e) });
    await fetch(`/api/trips/${tripId}/expenses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId, isPaid }),
    });
  };

  const markAllPaid = async () => {
    if (!trip) return;
    setTrip({ ...trip, expenses: trip.expenses.map((e) => ({ ...e, isPaid: true })) });
    await fetch(`/api/trips/${tripId}/expenses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllPaid: true }),
    });
  };

  const deleteExpense = async (id: string) => {
    if (!trip) return;
    setTrip({ ...trip, expenses: trip.expenses.filter((e) => e.id !== id) });
    await fetch(`/api/trips/${tripId}/expenses?expenseId=${id}`, { method: "DELETE" });
  };

  const downloadInvoice = () => {
    if (!invoiceRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>Invoice - ${trip?.name}</title><style>
      body{font-family:system-ui;padding:40px;color:#1a1a2e}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #e2e8f0}
      th{background:#f8fafc;font-weight:600;font-size:13px}
      td{font-size:13px}
      h1{font-size:24px;margin:0}h2{font-size:16px;margin:20px 0 10px}
      .total{font-size:18px;font-weight:700}
      .paid{color:#22c55e}.unpaid{color:#ef4444}
      @media print{body{padding:20px}}
    </style></head><body>`);
    printWindow.document.write(invoiceRef.current.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // Computed
  const allExpenses = useMemo(() => {
    if (!trip) return [];
    // Merge manual expenses + activity costs
    const activityExpenses: Expense[] = trip.stops.flatMap((stop) =>
      stop.activities.map((sa) => ({
        id: `act-${sa.id}`,
        category: "ACTIVITY",
        description: `${sa.activity.name} (${stop.city.name})`,
        amount: sa.estimatedCost ?? sa.activity.cost ?? 0,
        date: trip.startDate,
        isPaid: true,
      }))
    );
    return [...trip.expenses, ...activityExpenses];
  }, [trip]);

  const filtered = useMemo(() => {
    let result = allExpenses;
    if (search) result = result.filter((e) => e.description.toLowerCase().includes(search.toLowerCase()));
    if (filterCat) result = result.filter((e) => e.category === filterCat);
    if (sortBy === "amount") result = [...result].sort((a, b) => b.amount - a.amount);
    else if (sortBy === "category") result = [...result].sort((a, b) => a.category.localeCompare(b.category));
    else result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
  }, [allExpenses, search, filterCat, sortBy]);

  const subtotal = allExpenses.reduce((s, e) => s + e.amount, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const paidTotal = allExpenses.filter((e) => e.isPaid).reduce((s, e) => s + e.amount, 0);

  // Pie chart data
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of allExpenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [allExpenses]);

  const invoiceId = trip ? `INV-${trip.id.slice(0, 8).toUpperCase()}` : "";
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!trip) return <div className="text-center py-20"><p className="text-text-secondary">Trip not found.</p></div>;

  const inputClass = "w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link href={`/trips/${tripId}/itinerary`} className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Itinerary
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Expenses & Invoice 💰</h1>
        <p className="mt-1 text-text-secondary">{trip.name}</p>
      </motion.div>

      {/* Invoice header card */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-text-muted">Invoice ID</span><p className="font-bold text-text-primary mt-1 font-mono">{invoiceId}</p></div>
          <div><span className="text-text-muted">Date</span><p className="font-medium text-text-primary mt-1">{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p></div>
          <div><span className="text-text-muted">Destinations</span><p className="font-medium text-text-primary mt-1">{trip.stops.map((s) => s.city.name).join(", ") || "—"}</p></div>
          <div><span className="text-text-muted">Payment Status</span>
            <p className={`font-bold mt-1 ${paidTotal >= subtotal ? "text-emerald-500" : "text-amber-500"}`}>
              {paidTotal >= subtotal ? "✅ Paid" : `⏳ ${Math.round((paidTotal / (subtotal || 1)) * 100)}% Paid`}
            </p>
          </div>
        </div>
      </div>

      {/* Budget overview + pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Budget bar */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Full Budget View</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span className="font-medium text-text-primary">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Tax (5%)</span><span className="font-medium text-text-primary">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="border-t border-border pt-2 flex justify-between"><span className="font-bold text-text-primary">Total</span><span className="font-bold text-lg text-text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            {trip.budget && (
              <>
                <div className="flex justify-between"><span className="text-text-muted">Budget</span><span className="font-medium text-text-primary">${trip.budget.toLocaleString()}</span></div>
                <div className="w-full h-3 rounded-full bg-surface-elevated overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${total > trip.budget ? "bg-red-500" : "bg-gradient-to-r from-primary to-primary-light"}`}
                    style={{ width: `${Math.min((total / trip.budget) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Remaining</span>
                  <span className={`font-bold ${trip.budget - total < 0 ? "text-red-500" : "text-emerald-500"}`}>${Math.max(trip.budget - total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pie chart (CSS-based) */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-sm font-medium text-text-primary mb-3">Expense Breakdown</h3>
          <div className="flex items-center gap-6">
            {/* Visual pie */}
            <div className="w-32 h-32 rounded-full flex-shrink-0 relative" style={{
              background: categoryTotals.length > 0
                ? `conic-gradient(${categoryTotals.map(([cat], i) => {
                    const start = categoryTotals.slice(0, i).reduce((s, [, v]) => s + v, 0) / subtotal * 360;
                    const end = categoryTotals.slice(0, i + 1).reduce((s, [, v]) => s + v, 0) / subtotal * 360;
                    const colors = ["#3b82f6", "#6366f1", "#f59e0b", "#8b5cf6", "#ec4899", "#10b981", "#6b7280"];
                    return `${colors[i % colors.length]} ${start}deg ${end}deg`;
                  }).join(", ")})`
                : "#e2e8f0"
            }}>
              <div className="absolute inset-3 rounded-full bg-surface flex items-center justify-center">
                <span className="text-xs font-bold text-text-primary">${subtotal.toFixed(0)}</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-1.5">
              {categoryTotals.map(([cat, amount]) => {
                const meta = catMap[cat] || catMap.OTHER;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span>{meta.emoji}</span>
                      <span className="text-text-secondary">{meta.label}</span>
                    </span>
                    <span className="font-medium text-text-primary">${amount.toFixed(0)} ({subtotal ? Math.round(amount / subtotal * 100) : 0}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all text-sm">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
        <button onClick={markAllPaid} className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary rounded-xl hover:text-emerald-500 hover:border-emerald-300 transition-all text-sm">
          <CheckCircle2 className="w-4 h-4" /> Mark All Paid
        </button>
        <button onClick={downloadInvoice} className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary rounded-xl hover:text-primary hover:border-primary/30 transition-all text-sm">
          <Printer className="w-4 h-4" /> Export PDF
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              className="pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 w-40" />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer focus:outline-none">
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer focus:outline-none">
            <option value="date">By Date</option>
            <option value="amount">By Amount</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      {/* Add expense form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text-primary text-sm">Add Expense</h3>
                <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-text-muted" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" className={inputClass} />
                <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount ($)" className={inputClass} />
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className={inputClass + " appearance-none cursor-pointer"}>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <button onClick={addExpense} disabled={saving || !newDesc || !newAmount}
                className="w-full py-3 bg-primary text-white rounded-xl font-medium text-sm disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Add Expense"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expenses table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-elevated/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted">Description</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-text-muted">Amount</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-text-muted w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((exp) => {
                const meta = catMap[exp.category] || catMap.OTHER;
                const isActivity = exp.id.startsWith("act-");
                return (
                  <tr key={exp.id} className="hover:bg-surface-elevated/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2"><span>{meta.emoji}</span><span className="text-text-secondary">{meta.label}</span></span>
                    </td>
                    <td className="px-5 py-3 text-text-primary font-medium">{exp.description}</td>
                    <td className="px-5 py-3 text-right font-bold text-text-primary">${exp.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-center">
                      {isActivity ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium">Activity</span>
                      ) : (
                        <button onClick={() => togglePaid(exp.id, !exp.isPaid)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${exp.isPaid ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {exp.isPaid ? "Paid" : "Unpaid"}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {!isActivity && (
                        <button onClick={() => deleteExpense(exp.id)} className="p-1 text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-border">
              <tr><td colSpan={2} className="px-5 py-3 text-text-muted font-medium">Subtotal</td><td className="px-5 py-3 text-right font-bold text-text-primary">${subtotal.toFixed(2)}</td><td colSpan={2}></td></tr>
              <tr><td colSpan={2} className="px-5 py-2 text-text-muted">Tax (5%)</td><td className="px-5 py-2 text-right font-medium text-text-primary">${tax.toFixed(2)}</td><td colSpan={2}></td></tr>
              <tr className="bg-surface-elevated/50"><td colSpan={2} className="px-5 py-3 font-bold text-text-primary text-base">Total</td><td className="px-5 py-3 text-right font-bold text-lg text-primary">${total.toFixed(2)}</td><td colSpan={2}></td></tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Hidden printable invoice */}
      <div ref={invoiceRef} className="hidden">
        <h1>Invoice — {trip.name}</h1>
        <p><strong>Invoice ID:</strong> {invoiceId} | <strong>Date:</strong> {formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p>
        <p><strong>Destinations:</strong> {trip.stops.map((s) => s.city.name).join(", ")}</p>
        <table>
          <thead><tr><th>Category</th><th>Description</th><th style={{textAlign:"right"}}>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {allExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>{catMap[exp.category]?.label || "Other"}</td>
                <td>{exp.description}</td>
                <td style={{textAlign:"right"}}>${exp.amount.toFixed(2)}</td>
                <td className={exp.isPaid ? "paid" : "unpaid"}>{exp.isPaid ? "Paid" : "Unpaid"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Summary</h2>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax (5%): ${tax.toFixed(2)}</p>
        <p className="total">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
