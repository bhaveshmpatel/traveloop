"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Plane,
  Phone,
  MapPin,
  Globe,
  Camera,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup-only fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clearError = (field: string) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin) {
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      if (!phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[+]?[\d\s()-]{7,15}$/.test(phone.trim()))
        newErrors.phone = "Invalid phone number";
      if (!city.trim()) newErrors.city = "City is required";
      if (!country.trim()) newErrors.country = "Country is required";
    }

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin
        ? { email, password }
        : { firstName, lastName, email, password, phone, city, country };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-11 pr-4 py-3 rounded-xl bg-surface border ${
      errors[field]
        ? "border-red-400 focus:ring-red-300"
        : "border-border focus:ring-primary/30 focus:border-primary"
    } text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all text-sm`;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/auth-bg.png"
          alt="Travel adventure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Quote overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <blockquote className="text-3xl font-bold font-[var(--font-outfit)] text-white leading-snug max-w-lg">
              &ldquo;The world is a book, and those who do not travel read only
              one page.&rdquo;
            </blockquote>
            <p className="mt-4 text-white/60 text-lg">
              — Saint Augustine
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group mb-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/20">
              <Plane className="w-5 h-5 text-white rotate-[-30deg]" />
            </div>
            <span className="text-2xl font-bold font-[var(--font-outfit)] text-text-primary tracking-tight">
              Travel<span className="text-gradient">oop</span>
            </span>
          </Link>

          {/* Toggle heading */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold font-[var(--font-outfit)] text-text-primary">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-2 text-text-secondary">
                  {isLogin
                    ? "Sign in to continue planning your trips"
                    : "Start your journey with Traveloop today"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition-colors duration-200 text-sm font-medium text-text-primary">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition-colors duration-200 text-sm font-medium text-text-primary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-sm text-text-muted">or continue with email</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Server error */}
            {serverError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {serverError}
              </div>
            )}
            {/* Signup-only fields */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Photo Upload (Optional) */}
                    <div className="flex flex-col items-center gap-3 pb-2">
                      <div className="relative">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-primary/50 bg-surface-elevated flex items-center justify-center cursor-pointer transition-colors duration-200 overflow-hidden group"
                        >
                          {photoPreview ? (
                            <Image
                              src={photoPreview}
                              alt="Profile preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Camera className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        {photoPreview && (
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-text-muted">
                        Upload photo{" "}
                        <span className="text-text-muted/60">(optional)</span>
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="auth-photo"
                      />
                    </div>

                    {/* First Name & Last Name — side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="auth-firstname"
                          className="block text-sm font-medium text-text-primary mb-1.5"
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                          <input
                            id="auth-firstname"
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              clearError("firstName");
                            }}
                            placeholder="John"
                            className={inputClass("firstName")}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="auth-lastname"
                          className="block text-sm font-medium text-text-primary mb-1.5"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                          <input
                            id="auth-lastname"
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              clearError("lastName");
                            }}
                            placeholder="Doe"
                            className={inputClass("lastName")}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="auth-phone"
                        className="block text-sm font-medium text-text-primary mb-1.5"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                        <input
                          id="auth-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            clearError("phone");
                          }}
                          placeholder="+91 98765 43210"
                          className={inputClass("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* City & Country — side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="auth-city"
                          className="block text-sm font-medium text-text-primary mb-1.5"
                        >
                          City
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                          <input
                            id="auth-city"
                            type="text"
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                              clearError("city");
                            }}
                            placeholder="Mumbai"
                            className={inputClass("city")}
                          />
                        </div>
                        {errors.city && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="auth-country"
                          className="block text-sm font-medium text-text-primary mb-1.5"
                        >
                          Country
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                          <input
                            id="auth-country"
                            type="text"
                            value={country}
                            onChange={(e) => {
                              setCountry(e.target.value);
                              clearError("country");
                            }}
                            placeholder="India"
                            className={inputClass("country")}
                          />
                        </div>
                        {errors.country && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label
                htmlFor="auth-email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-surface border ${
                    errors.password
                      ? "border-red-400 focus:ring-red-300"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  } text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-8 text-center text-sm text-text-secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
