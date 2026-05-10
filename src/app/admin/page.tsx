"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, Filter, Plus, Trash2, Shield, Users, MapPin, Compass, BarChart3, Loader2, X } from "lucide-react";

type Tab = "analytics" | "users" | "cities" | "activities";

interface Stats { totalUsers: number; totalTrips: number; totalCities: number; totalActivities: number; totalPosts: number; totalExpenses: number }
interface UserRow { id: string; firstName: string; lastName: string; email: string; role: string; city: string|null; country: string|null; createdAt: string; _count: { trips: number; communityPosts: number } }
interface CityRow { id: string; name: string; country: string; region: string; costIndex: number; popularity: number; _count: { activities: number; stops: number } }
interface ActRow { id: string; name: string; type: string; cost: number; duration: number; city: { name: string; country: string } }

const tabs: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "users", label: "Users", icon: Users },
  { key: "cities", label: "Cities", icon: MapPin },
  { key: "activities", label: "Activities", icon: Compass },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [tripsByStatus, setTripsByStatus] = useState<{status:string;count:number}[]>([]);
  const [topCities, setTopCities] = useState<{city:any;trips:number}[]>([]);
  const [actTypes, setActTypes] = useState<{type:string;count:number}[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [cities, setCities] = useState<CityRow[]>([]);
  const [activities, setActivities] = useState<ActRow[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterVal, setFilterVal] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showAddAct, setShowAddAct] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(d => {
      if (d.error) { setError(d.error); setLoading(false); return; }
      setStats(d.stats); setTripsByStatus(d.tripsByStatus||[]); setTopCities(d.topCitiesData||[]); setActTypes(d.activityTypes||[]);
      setLoading(false);
    }).catch(() => { setError("Failed to load"); setLoading(false); });
  }, []);

  useEffect(() => { 
    if (tab === "users") fetchUsers(); 
    if (tab === "cities") fetchCities(); 
    if (tab === "activities") {
      fetchActs();
      if (cities.length === 0) fetchCities();
    }
  }, [tab]);

  const fetchUsers = () => fetch("/api/admin/users").then(r=>r.json()).then(d=>setUsers(d.users||[]));
  const fetchCities = () => fetch("/api/admin/cities").then(r=>r.json()).then(d=>setCities(d.cities||[]));
  const fetchActs = () => fetch("/api/admin/activities").then(r=>r.json()).then(d=>setActivities(d.activities||[]));

  const toggleRole = async (u: UserRow) => {
    const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";
    await fetch("/api/admin/users", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ userId: u.id, role: newRole }) });
    fetchUsers();
  };
  const deleteUser = async (id: string) => { if (!confirm("Delete this user?")) return; await fetch(`/api/admin/users?userId=${id}`, { method: "DELETE" }); fetchUsers(); };
  const deleteCity = async (id: string) => { if (!confirm("Delete this city?")) return; await fetch(`/api/admin/cities?cityId=${id}`, { method: "DELETE" }); fetchCities(); };
  const deleteAct = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/activities?activityId=${id}`, { method: "DELETE" }); fetchActs(); };

  const filteredUsers = useMemo(() => {
    let r = users;
    if (search) r = r.filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
    if (filterVal === "admin") r = r.filter(u => u.role === "ADMIN");
    if (filterVal === "user") r = r.filter(u => u.role === "USER");
    if (sortBy === "name") r = [...r].sort((a,b) => a.firstName.localeCompare(b.firstName));
    if (sortBy === "trips") r = [...r].sort((a,b) => b._count.trips - a._count.trips);
    if (sortBy === "newest") r = [...r].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return r;
  }, [users, search, filterVal, sortBy]);

  const filteredCities = useMemo(() => {
    let r = cities;
    if (search) r = r.filter(c => `${c.name} ${c.country} ${c.region}`.toLowerCase().includes(search.toLowerCase()));
    if (filterVal) r = r.filter(c => c.region === filterVal);
    if (sortBy === "name") r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === "popularity") r = [...r].sort((a,b) => b.popularity - a.popularity);
    if (sortBy === "activities") r = [...r].sort((a,b) => b._count.activities - a._count.activities);
    return r;
  }, [cities, search, filterVal, sortBy]);

  const filteredActs = useMemo(() => {
    let r = activities;
    if (search) r = r.filter(a => `${a.name} ${a.city.name}`.toLowerCase().includes(search.toLowerCase()));
    if (filterVal) r = r.filter(a => a.type === filterVal);
    if (sortBy === "name") r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === "cost") r = [...r].sort((a,b) => b.cost - a.cost);
    if (sortBy === "duration") r = [...r].sort((a,b) => b.duration - a.duration);
    return r;
  }, [activities, search, filterVal, sortBy]);

  const regions = [...new Set(cities.map(c => c.region))];
  const activityTypesList = [...new Set(activities.map(a => a.type))];

  const ic = "w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error === "Forbidden") return <div className="text-center py-20"><Shield className="w-16 h-16 mx-auto text-red-400 mb-4" /><h2 className="text-xl font-bold text-text-primary">Access Denied</h2><p className="text-text-secondary mt-2">Admin privileges required.</p></div>;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
        <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">Admin Panel 🛡️</h1>
        <p className="mt-1 text-text-secondary">Manage platform data and view analytics</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-3 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSearch(""); setFilterVal(""); setSortBy("default"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.key ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-text-secondary hover:text-primary hover:bg-primary/5"}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ANALYTICS TAB */}
      {tab === "analytics" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Users", value: stats.totalUsers, emoji: "👥" },
              { label: "Trips", value: stats.totalTrips, emoji: "✈️" },
              { label: "Cities", value: stats.totalCities, emoji: "🌍" },
              { label: "Activities", value: stats.totalActivities, emoji: "🎯" },
              { label: "Posts", value: stats.totalPosts, emoji: "💬" },
              { label: "Expenses", value: stats.totalExpenses, emoji: "💰" },
            ].map(s => (
              <div key={s.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
                <span className="text-2xl">{s.emoji}</span>
                <p className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary mt-1">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trip Status */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-primary mb-4">Trip Status Distribution</h3>
              {tripsByStatus.map(t => {
                const total = tripsByStatus.reduce((s,x) => s + x.count, 0);
                const pct = total ? Math.round(t.count / total * 100) : 0;
                const colors: Record<string,string> = { PLANNING: "bg-blue-500", ONGOING: "bg-amber-500", COMPLETED: "bg-emerald-500" };
                return (
                  <div key={t.status} className="mb-3">
                    <div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">{t.status}</span><span className="font-medium text-text-primary">{t.count} ({pct}%)</span></div>
                    <div className="w-full h-2.5 rounded-full bg-surface-elevated"><div className={`h-full rounded-full ${colors[t.status]||"bg-gray-400"}`} style={{width:`${pct}%`}} /></div>
                  </div>
                );
              })}
            </div>

            {/* Activity Types */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-primary mb-4">Activity Types</h3>
              <div className="space-y-2">
                {actTypes.map(a => {
                  const total = actTypes.reduce((s,x) => s + x.count, 0);
                  const pct = total ? Math.round(a.count / total * 100) : 0;
                  return (
                    <div key={a.type} className="flex items-center gap-3">
                      <span className="text-xs text-text-secondary w-24 truncate">{a.type}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-surface-elevated"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" style={{width:`${pct}%`}} /></div>
                      <span className="text-xs font-medium text-text-primary w-12 text-right">{a.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Cities */}
            <div className="bg-surface border border-border rounded-2xl p-5 lg:col-span-2">
              <h3 className="text-sm font-medium text-text-primary mb-4">Top Cities by Trips</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {topCities.map((t,i) => (
                  <div key={i} className="bg-surface-elevated rounded-xl p-3 text-center">
                    <p className="font-bold text-text-primary text-sm">{t.city?.name || "Unknown"}</p>
                    <p className="text-xs text-text-muted">{t.city?.country}</p>
                    <p className="text-lg font-bold text-primary mt-1">{t.trips}</p>
                    <p className="text-[10px] text-text-muted">trips</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {tab === "users" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={filterVal} onChange={e=>setFilterVal(e.target.value)} className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer">
              <option value="">All Roles</option><option value="admin">Admin</option><option value="user">User</option>
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer">
              <option value="default">Default</option><option value="name">Name</option><option value="trips">Most Trips</option><option value="newest">Newest</option>
            </select>
          </div>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm"><thead><tr className="border-b border-border bg-surface-elevated/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">Email</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Role</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Trips</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Posts</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted w-24">Actions</th>
            </tr></thead><tbody className="divide-y divide-border">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface-elevated/30"><td className="px-4 py-3 font-medium text-text-primary">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3 text-center"><button onClick={()=>toggleRole(u)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.role==="ADMIN"?"bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400":"bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"}`}>{u.role}</button></td>
                  <td className="px-4 py-3 text-center text-text-primary">{u._count.trips}</td>
                  <td className="px-4 py-3 text-center text-text-primary">{u._count.communityPosts}</td>
                  <td className="px-4 py-3 text-center"><button onClick={()=>deleteUser(u.id)} className="p-1 text-text-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <p className="text-xs text-text-muted mt-2">{filteredUsers.length} users</p>
        </div>
      )}

      {/* CITIES TAB */}
      {tab === "cities" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cities..." className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={filterVal} onChange={e=>setFilterVal(e.target.value)} className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer">
              <option value="">All Regions</option>{regions.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer">
              <option value="default">Default</option><option value="name">Name</option><option value="popularity">Popularity</option><option value="activities">Activities</option>
            </select>
            <button onClick={()=>setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:scale-105 transition-all"><Plus className="w-4 h-4" />Add</button>
          </div>
          {showAdd && <AddCityForm ic={ic} onDone={()=>{setShowAdd(false);fetchCities();}} />}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm"><thead><tr className="border-b border-border bg-surface-elevated/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">City</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">Country</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Region</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Pop.</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Activities</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Trips</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted w-16"></th>
            </tr></thead><tbody className="divide-y divide-border">
              {filteredCities.map(c=>(
                <tr key={c.id} className="hover:bg-surface-elevated/30"><td className="px-4 py-3 font-medium text-text-primary">{c.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{c.country}</td>
                  <td className="px-4 py-3 text-center"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.region}</span></td>
                  <td className="px-4 py-3 text-center text-text-primary">{c.popularity}</td>
                  <td className="px-4 py-3 text-center text-text-primary">{c._count.activities}</td>
                  <td className="px-4 py-3 text-center text-text-primary">{c._count.stops}</td>
                  <td className="px-4 py-3 text-center"><button onClick={()=>deleteCity(c.id)} className="p-1 text-text-muted hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <p className="text-xs text-text-muted mt-2">{filteredCities.length} cities</p>
        </div>
      )}

      {/* ACTIVITIES TAB */}
      {tab === "activities" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search activities..." className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={filterVal} onChange={e=>setFilterVal(e.target.value)} className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer">
              <option value="">All Types</option>{activityTypesList.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary appearance-none cursor-pointer">
              <option value="default">Default</option><option value="name">Name</option><option value="cost">Cost</option><option value="duration">Duration</option>
            </select>
            <button onClick={()=>setShowAddAct(!showAddAct)} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:scale-105 transition-all"><Plus className="w-4 h-4" />Add</button>
          </div>
          {showAddAct && <AddActivityForm ic={ic} cities={cities} onDone={()=>{setShowAddAct(false);fetchActs();}} />}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm"><thead><tr className="border-b border-border bg-surface-elevated/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">Activity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">City</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Type</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted">Cost</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted">Hours</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted w-16"></th>
            </tr></thead><tbody className="divide-y divide-border">
              {filteredActs.map(a=>(
                <tr key={a.id} className="hover:bg-surface-elevated/30"><td className="px-4 py-3 font-medium text-text-primary">{a.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{a.city.name}</td>
                  <td className="px-4 py-3 text-center"><span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary">{a.type}</span></td>
                  <td className="px-4 py-3 text-right font-medium text-text-primary">{a.cost===0?"Free":`$${a.cost}`}</td>
                  <td className="px-4 py-3 text-center text-text-primary">{a.duration}h</td>
                  <td className="px-4 py-3 text-center"><button onClick={()=>deleteAct(a.id)} className="p-1 text-text-muted hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <p className="text-xs text-text-muted mt-2">{filteredActs.length} activities</p>
        </div>
      )}
    </div>
  );
}

function AddCityForm({ ic, onDone }: { ic: string; onDone: () => void }) {
  const [name,setName]=useState(""); const [country,setCountry]=useState(""); const [region,setRegion]=useState(""); 
  const [description,setDescription]=useState(""); const [imageUrl,setImageUrl]=useState(""); const [saving,setSaving]=useState(false);
  const submit = async () => {
    if(!name||!country) return; setSaving(true);
    await fetch("/api/admin/cities",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,country,region:region||"Other",description,imageUrl})});
    setSaving(false); onDone();
  };
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 mb-4 flex gap-3 flex-col">
      <div className="flex gap-3 flex-wrap">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="City name" className={ic+" flex-1 min-w-[150px]"} />
        <input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country" className={ic+" flex-1 min-w-[150px]"} />
        <input value={region} onChange={e=>setRegion(e.target.value)} placeholder="Region" className={ic+" w-32"} />
      </div>
      <div className="flex gap-3 flex-wrap">
        <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL (e.g. Unsplash)" className={ic+" flex-1 min-w-[200px]"} />
        <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="About city (Description)" className={ic+" flex-[2] min-w-[200px]"} />
      </div>
      <div className="flex justify-end">
        <button onClick={submit} disabled={saving} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">{saving?"Saving...":"Add City"}</button>
      </div>
    </div>
  );
}

function AddActivityForm({ ic, cities, onDone }: { ic: string; cities: CityRow[]; onDone: () => void }) {
  const [name,setName]=useState(""); const [cityId,setCityId]=useState(""); const [type,setType]=useState("SIGHTSEEING");
  const [cost,setCost]=useState(""); const [duration,setDuration]=useState(""); const [description,setDescription]=useState("");
  const [saving,setSaving]=useState(false);
  const submit = async () => {
    if(!name||!cityId) return; setSaving(true);
    await fetch("/api/admin/activities",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,cityId,type,cost:parseFloat(cost),duration:parseFloat(duration),description})});
    setSaving(false); onDone();
  };
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 mb-4 flex gap-3 flex-col">
      <div className="flex gap-3 flex-wrap">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Activity name" className={ic+" flex-[2] min-w-[200px]"} />
        <select value={cityId} onChange={e=>setCityId(e.target.value)} className={ic+" flex-1 min-w-[150px]"}>
          <option value="">Select City</option>
          {cities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={type} onChange={e=>setType(e.target.value)} className={ic+" flex-1 min-w-[150px]"}>
          {["SIGHTSEEING","CULTURE","FOOD","NATURE","ADVENTURE","SHOPPING","RELAXATION"].map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex gap-3 flex-wrap">
        <input type="number" value={cost} onChange={e=>setCost(e.target.value)} placeholder="Cost ($)" className={ic+" flex-1 min-w-[100px]"} />
        <input type="number" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Duration (hours)" className={ic+" flex-1 min-w-[100px]"} />
        <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="About activity (Description)" className={ic+" flex-[3] min-w-[200px]"} />
      </div>
      <div className="flex justify-end">
        <button onClick={submit} disabled={saving} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">{saving?"Saving...":"Add Activity"}</button>
      </div>
    </div>
  );
}
