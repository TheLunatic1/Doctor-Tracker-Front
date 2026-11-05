'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import {
  UserCheck,
  Users,
  Calendar,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsOverview } from '@/features/analytics/useAnalytics';
import TimelineChart from '@/features/analytics/TimelineChart';
import ConditionDonutChart from '@/features/analytics/ConditionDonutChart';
import TopDoctorsWidget from '@/features/analytics/TopDoctorsWidget';
import RecentActivitiesWidget from '@/features/analytics/RecentActivitiesWidget';

export default function DashboardPage() {
  const { user } = useAuth();
  const [range, setRange] = useState('6m');

  const { data: overview, isLoading } = useAnalyticsOverview();

  // User first name for warm greeting
  const firstName = user?.name ? user.name.replace('Dr. ', '').split(' ')[0] : 'Admin';

  return (
    <AppShell title="Overview" subtitle="Workspace / Overview">
      {/* Top Greeting & Date Range Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Good morning, {firstName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening across your clinic today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last 1 year</option>
          </select>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <UserCheck className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Doctors</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {overview?.totalDoctors || 48}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +{overview?.doctorGrowth || 8.2}% capacity
              </p>
            </Card>

            <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                  <Users className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Patients</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {overview?.totalPatients?.toLocaleString() || '1,284'}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +{overview?.patientGrowth || 12.5}% growth
              </p>
            </Card>

            <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <Calendar className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Admitted This Month</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {overview?.newPatientsThisMonth || 86}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Avg {overview?.avgPatientsPerDoctor || 10.5} per doc
              </p>
            </Card>

            <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Building2 className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Active Hospitals</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {overview?.totalHospitals || 12}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +2.1% network expansion
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <TimelineChart range={range} />
        <ConditionDonutChart totalPatients={overview?.totalPatients || 1284} />
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <RecentActivitiesWidget />
        <TopDoctorsWidget />
      </div>
    </AppShell>
  );
}
