'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Mail, Lock, Eye, EyeOff, LogIn, TrendingUp, Users, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch {
      // Error toast is handled inside AuthContext
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@doctortracker.com');
    setPassword('Admin123456!');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-blue-50">
      {/* Left Column: Healthcare Brand & Value Proposition (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-blue-950 text-white">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-lg shadow-sky-950/20">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Doctor <span className="text-sky-300">Tracker</span>
          </span>
        </Link>

        {/* Main Pitch */}
        <div className="max-w-md space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-sky-200 backdrop-blur-sm border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            Healthcare Administration Platform
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome Back!
          </h2>
          <p className="text-base text-sky-100/90 leading-relaxed">
            Sign in to access your administrative dashboard, monitor real-time clinical metrics, and seamlessly manage doctors and patients.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3.5 rounded-2xl bg-white/5 p-3.5 border border-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Track Analytics</p>
                <p className="text-xs text-sky-200">Gain actionable insights with automated charts</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl bg-white/5 p-3.5 border border-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Manage Doctors</p>
                <p className="text-xs text-sky-200">Organize schedules, specializations, and staff</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl bg-white/5 p-3.5 border border-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Manage Patients</p>
                <p className="text-xs text-sky-200">Maintain comprehensive patient medical records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-sky-200/70 relative z-10">
          © {new Date().getFullYear()} Doctor Tracker. All rights reserved.
        </p>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 md:p-10 shadow-xl shadow-sky-900/5 border border-slate-100">
          {/* Mobile Header / Brand */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 mb-4">
              <Activity className="h-8 w-8 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Sign In
            </h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Quick Demo Fill Pill */}
          <div className="rounded-xl bg-sky-50 p-3 border border-sky-100 text-center">
            <p className="text-xs text-sky-900 font-medium mb-1.5">Recruiter / Demo Quick Login</p>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition-colors shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Fill Demo Admin Credentials
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="name@doctortracker.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Remember Me
              </label>
              <span className="text-sky-600 hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 font-semibold text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <span className="font-semibold text-sky-600 hover:underline cursor-pointer">
              Contact Admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
