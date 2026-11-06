'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalyticsOverview } from '@/features/analytics/useAnalytics';
import TimelineChart from '@/features/analytics/TimelineChart';
import ConditionDonutChart from '@/features/analytics/ConditionDonutChart';
import TopDoctorsWidget from '@/features/analytics/TopDoctorsWidget';
import RecentActivitiesWidget from '@/features/analytics/RecentActivitiesWidget';
import {
  TrendingUp,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Activity,
  Award,
  ArrowUpRight,
} from 'lucide-react';

const HOSPITALS_DATA = [
  { name: 'Apollo Hospital', doctors: 8, patients: 112, avgPerDoc: 14.0, status: 'Active' },
  { name: 'Square Hospital', doctors: 7, patients: 98, avgPerDoc: 14.0, status: 'Active' },
  { name: 'United Hospital', doctors: 6, patients: 84, avgPerDoc: 14.0, status: 'Active' },
  { name: 'Evercare Hospital', doctors: 5, patients: 70, avgPerDoc: 14.0, status: 'Active' },
  { name: 'National Medical Center', doctors: 5, patients: 62, avgPerDoc: 12.4, status: 'Active' },
  { name: 'City Health Hospital', doctors: 5, patients: 45, avgPerDoc: 9.0, status: 'Active' },
  { name: 'Care Medical Center', doctors: 4, patients: 36, avgPerDoc: 9.0, status: 'Active' },
  { name: 'Central Hospital', doctors: 4, patients: 24, avgPerDoc: 6.0, status: 'Active' },
  { name: 'Health Plus Hospital', doctors: 3, patients: 12, avgPerDoc: 4.0, status: 'Active' },
  { name: 'Skin Care Hospital', doctors: 2, patients: 6, avgPerDoc: 3.0, status: 'Active' },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === 'patient') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const { data: overview, isLoading } = useAnalyticsOverview();
  const [timelineRange, setTimelineRange] = useState<string>('30d');

  return (
    <AppShell title="Clinical Analytics" subtitle="Comprehensive patient admission trends, physician workloads & clinical metrics">
      <div className="space-y-6 pb-12">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {overview?.totalPatients || 549}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+12.5% vs previous quarter</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Staff</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {overview?.totalDoctors || 49} Doctors
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Stethoscope className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-slate-500">
              <span>Across 10 partner hospitals</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Patient / Doctor</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {overview?.avgPatientsPerDoctor ? overview.avgPatientsPerDoctor.toFixed(1) : '11.4'}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-600">
              <span>Optimal clinical ratio (&lt;15)</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facilities</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {overview?.totalHospitals || 10} Hospitals
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-600">
              <span>100% operational status</span>
            </div>
          </Card>
        </div>

        {/* Admissions Timeline Chart */}
        <div className="grid grid-cols-1 gap-6">
          <TimelineChart range={timelineRange} />
        </div>

        {/* Middle Section: Condition Donut & Top Doctors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <ConditionDonutChart />
          </div>
          <div className="lg:col-span-6">
            <TopDoctorsWidget />
          </div>
        </div>

        {/* Hospital Workload Breakdown Table */}
        <Card className="border-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 p-5 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Hospital Distribution & Workload Matrix</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Physician staffing and active patient allocations by affiliated facility</p>
              </div>
              <Badge variant="blue" className="text-xs px-3 py-1 font-semibold">
                10 Facilities Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Facility Name</th>
                  <th className="py-3 px-5">Assigned Doctors</th>
                  <th className="py-3 px-5">Admitted Patients</th>
                  <th className="py-3 px-5">Avg Workload / Doctor</th>
                  <th className="py-3 px-5">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {HOSPITALS_DATA.map((hosp, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-sky-600 shrink-0" />
                      {hosp.name}
                    </td>
                    <td className="py-3.5 px-5 font-medium">{hosp.doctors} Doctors</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{hosp.patients} Patients</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-sky-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, (hosp.avgPerDoc / 20) * 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold">{hosp.avgPerDoc.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {hosp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
