'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  BarChart3,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Doctor <span className="text-sky-600">Tracker</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="text-sky-600 font-semibold transition-colors">
              Home
            </Link>
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#about" className="hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#tech" className="hover:text-slate-900 transition-colors">
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild variant="primary" className="gap-2 rounded-full px-5">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="primary" className="gap-2 rounded-full px-6">
                <Link href="/login">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-sky-50/50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/70 px-4 py-1.5 text-xs font-semibold text-sky-800 border border-sky-200">
                <span className="flex h-2 w-2 rounded-full bg-sky-600 animate-pulse" />
                Smart Healthcare Management
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                Doctor <span className="text-sky-600">Tracker</span>
              </h1>

              <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                Manage Doctors, Patients & Analytics in One Powerful Platform
              </p>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A modern and secure admin dashboard to monitor doctors, keep patient records organized, and visualize healthcare metrics with ease.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Button asChild variant="primary" size="lg" className="rounded-2xl px-8 shadow-lg shadow-sky-600/20 text-base">
                  <Link href="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl px-7 bg-white text-base">
                  <Link href="/dashboard">
                    Live Demo
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Production Ready
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" /> Fast Aggregations
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-sky-600" /> Secure JWT Cookies
                </span>
              </div>
            </div>

            {/* Right Hero Graphic: Styled Dashboard Preview Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-sky-900/10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-semibold text-slate-400">CareTrack Admin Portal</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    Live System
                  </span>
                </div>

                {/* Stat Cards Mini */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
                  <div className="rounded-xl bg-sky-50/70 p-3 border border-sky-100">
                    <p className="text-[11px] text-sky-700 font-medium">Total Doctors</p>
                    <p className="text-xl font-bold text-sky-950 mt-1">48</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">↑ +8.2%</span>
                  </div>
                  <div className="rounded-xl bg-teal-50/70 p-3 border border-teal-100">
                    <p className="text-[11px] text-teal-700 font-medium">Total Patients</p>
                    <p className="text-xl font-bold text-teal-950 mt-1">1,284</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">↑ +12.5%</span>
                  </div>
                  <div className="rounded-xl bg-indigo-50/70 p-3 border border-indigo-100">
                    <p className="text-[11px] text-indigo-700 font-medium">Monthly Active</p>
                    <p className="text-xl font-bold text-indigo-950 mt-1">246</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">↑ +6.4%</span>
                  </div>
                  <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-100">
                    <p className="text-[11px] text-amber-700 font-medium">Hospitals</p>
                    <p className="text-xl font-bold text-amber-950 mt-1">12</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">↑ +2.1%</span>
                  </div>
                </div>

                {/* Simulated Chart Graphic */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Patient Registrations Over Time</p>
                      <p className="text-[11px] text-slate-400">Monthly breakdown with continuous zero-fill</p>
                    </div>
                    <span className="text-xs rounded-lg bg-white/10 px-2 py-1 text-sky-300 font-medium">
                      +18.6% Growth
                    </span>
                  </div>
                  <div className="h-32 flex items-end gap-2 pt-4 px-2">
                    {[45, 60, 52, 75, 82, 95, 88, 102, 115, 128, 142, 160].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-sky-500 to-blue-400 hover:brightness-110 transition-all"
                          style={{ height: `${(val / 160) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Secure & Reliable</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Your data is always safe with robust JWT authentication in httpOnly cookies.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Easy Management</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Add and manage doctors and their patients effortlessly with nested relations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Powerful Analytics</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Get real-time insights with MongoDB aggregation pipelines and interactive Recharts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Modern UI/UX</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Enjoy a clean, responsive, and intuitive interface designed specifically for healthcare.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Optimized Speed</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Compound indexes and lean queries guarantee lightning-fast response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Doctor Tracker */}
      <section id="about" className="py-24 bg-gradient-to-b from-white to-sky-50/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-tr from-sky-600 to-blue-700 p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Doctor Tracker Engine</p>
                    <p className="text-xs text-sky-100">Enterprise Healthcare Grade</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs text-sky-200 uppercase font-semibold">Indexed Queries</p>
                    <p className="text-xl font-bold mt-1">IXSCAN &lt; 5ms</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs text-sky-200 uppercase font-semibold">Data Pipeline</p>
                    <p className="text-xl font-bold mt-1">Zero-Fill Aggregations</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs text-sky-200 uppercase font-semibold">Cookie Proxy</p>
                    <p className="text-xl font-bold mt-1">First-Party httpOnly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-semibold text-sky-800">
                Why Choose Doctor Tracker?
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                A Smarter Way to Manage Your Healthcare System
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                From tracking doctors to analyzing patient demographics and admission trends, Doctor Tracker helps clinical managers streamline administrative operations and make informed, data-driven decisions.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Comprehensive Doctor & Patient Record Management',
                  'Real-time Data Visualization & Trend Indicators',
                  'Secure Authentication & Role-Based Access Control',
                  'Fully Responsive Across Desktop, Tablet & Mobile Views',
                  'Built with Next.js 15, TypeScript, Tailwind & MongoDB',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button asChild variant="primary" size="lg" className="rounded-2xl px-8">
                  <Link href="/login">
                    Access Admin Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900">Doctor Tracker</span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Doctor Tracker Platform. Built for excellence in healthcare administration.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <Link href="/login" className="hover:text-sky-600 transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="hover:text-sky-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/doctors" className="hover:text-sky-600 transition-colors">
              Doctors
            </Link>
            <Link href="/patients" className="hover:text-sky-600 transition-colors">
              Patients
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
