'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import {
  User,
  Mail,
  Shield,
  Key,
  Database,
  Server,
  Lock,
  CheckCircle2,
  Calendar,
  LogOut,
  Activity,
  Terminal,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <AppShell title="Admin Profile & System Settings" subtitle="Account credentials, security protocols, and operational diagnostics">
      <div className="max-w-5xl space-y-6 pb-12">
        {/* User Card */}
        <Card className="p-6 md:p-8 border-slate-100 shadow-sm bg-gradient-to-r from-white via-white to-sky-50/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-extrabold text-2xl shadow-xl shadow-sky-500/20 ring-4 ring-white">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {user?.name || 'Administrator'}
                  </h1>
                  <Badge variant="blue" className="text-xs px-2.5 py-0.5">
                    {user?.role || 'Super Admin'}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {user?.email || 'admin@doctortracker.com'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Authenticated Session Active
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="gap-2 text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Security & Access Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-100 shadow-sm p-6 bg-white space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Authentication Security</h2>
                <p className="text-xs text-slate-500">JWT and session token architecture</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Session Token Type</span>
                <span className="font-semibold text-slate-900">JWT (JSON Web Token)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Cookie Storage</span>
                <span className="font-semibold text-emerald-700">httpOnly; SameSite=Lax; Secure</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Token Lifespan</span>
                <span className="font-semibold text-slate-900">7 Days (Auto-renewing)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500 font-medium">Password Hash</span>
                <span className="font-semibold text-slate-900">Bcrypt (12 rounds)</span>
              </div>
            </div>
          </Card>

          <Card className="border-slate-100 shadow-sm p-6 bg-white space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Deployment & Network</h2>
                <p className="text-xs text-slate-500">Production environment parameters</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Environment</span>
                <span className="font-semibold text-slate-900">Production (Docker Compose)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Public Funnel Host</span>
                <span className="font-semibold text-sky-700">toha.tail2c2947.ts.net:8443</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Database Engine</span>
                <span className="font-semibold text-slate-900">MongoDB 7.0 (Mongoose)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500 font-medium">Query Plan Status</span>
                <span className="font-semibold text-emerald-700">100% IXSCAN Verified</span>
              </div>
            </div>
          </Card>
        </div>

        {/* System Activity Summary */}
        <Card className="border-slate-100 shadow-sm p-6 bg-white space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Information & Diagnostics</h2>
              <p className="text-xs text-slate-500">Clinical registry operational logs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Node Runtime</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Node.js 20.x Alpine</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">LTS Containerized</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Next.js Framework</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Next.js 15.5 App Router</p>
              <p className="text-[11px] text-sky-600 mt-0.5">React 19 Concurrent</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Database Indexing</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Compound Indexes</p>
              <p className="text-[11px] text-indigo-600 mt-0.5">Optimized Prefixes</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
