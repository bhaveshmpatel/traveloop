"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, LayoutDashboard, Map, Compass, Users, UserCircle,
  LogOut, Menu, X, Bell, Sun, Moon, Monitor,
} from "lucide-react";

interface User {
  id: string; firstName: string; lastName: string;
  email: string; photoUrl: string | null;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Map },
  { href: "/explore/cities", label: "Explore", icon: Compass },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

type Theme = "light" | "dark" | "system";
const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export default function DashboardNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => { if (data.user) setUser(data.user); else router.push("/auth"); })
      .catch(() => router.push("/auth"));
  }, [router]);

  // Theme initialization
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) { setTheme(saved); applyTheme(saved); }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") { root.classList.add("dark"); }
    else if (t === "light") { root.classList.remove("dark"); }
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark"); else root.classList.remove("dark");
    }
  };

  const switchTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
    setShowThemeMenu(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "";

  const currentThemeIcon = themeOptions.find((t) => t.value === theme)?.icon || Sun;
  const ThemeIcon = currentThemeIcon;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/70 backdrop-blur-md"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/20">
              <Plane className="w-5 h-5 text-white rotate-[-30deg]" />
            </div>
            <span className="text-xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
              Travel<span className="text-gradient">oop</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary rounded-xl hover:bg-primary/5 transition-all duration-200">
                <link.icon className="w-4 h-4" />{link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <div className="relative">
              <button onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors" title="Switch theme">
                <ThemeIcon className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-xl shadow-xl p-1.5 min-w-[140px] z-50">
                    {themeOptions.map((opt) => (
                      <button key={opt.value} onClick={() => switchTheme(opt.value)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          theme === opt.value ? "bg-primary/10 text-primary font-medium" : "text-text-secondary hover:text-primary hover:bg-primary/5"
                        }`}>
                        <opt.icon className="w-4 h-4" />{opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="relative p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* Avatar */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
                  {initials}
                </div>
                <button onClick={handleLogout} className="p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Logout">
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl text-text-secondary hover:text-primary transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:text-primary rounded-xl hover:bg-primary/5 transition-all">
                  <link.icon className="w-5 h-5" />{link.label}
                </Link>
              ))}
              {/* Theme in mobile */}
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-sm font-medium text-text-muted mr-2">Theme:</span>
                {themeOptions.map((opt) => (
                  <button key={opt.value} onClick={() => switchTheme(opt.value)}
                    className={`p-2 rounded-lg transition-all ${theme === opt.value ? "bg-primary/10 text-primary" : "text-text-muted hover:text-primary"}`}>
                    <opt.icon className="w-4.5 h-4.5" />
                  </button>
                ))}
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <LogOut className="w-5 h-5" />Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
