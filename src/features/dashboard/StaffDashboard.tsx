'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { User } from '@/types';

interface StaffDashboardProps {
  user: User;
}

export default function StaffDashboard({ user }: StaffDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 to-emerald-800 p-6 md:p-8 text-white shadow-lg shadow-teal-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Activity className="h-3.5 w-3.5" />
              Admissions & Intake Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Clinic Coordination Hub • Coordinate patient intake, manage active hospital beds, and assign physicians.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="secondary"
              className="bg-white text-teal-800 hover:bg-teal-50 shadow-md rounded-xl font-semibold text-xs"
            >
              <Link href="/patients?action=create">
                <UserPlus className="h-4 w-4 mr-1.5" />
                Admit New Patient
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Desk Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active In-Patients</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">384</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> 84% ward capacity
          </p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Doctors on Shift</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">32</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Across 10 hospital centers</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Today&apos;s Admissions</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">18</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3">All physicians assigned</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Critical Priority</p>
              <p className="text-2xl font-black text-rose-600 mt-0.5">4</p>
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-3">Immediate observation</p>
        </Card>
      </div>

      {/* Desk Queue & Quick Intakes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Patient Intakes</h3>
                <p className="text-xs text-slate-400">Processed by admissions desk today</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-teal-700 hover:text-teal-800">
                <Link href="/patients">Manage Roster →</Link>
              </Button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { name: 'Kazi Nazrul Islam', doctor: 'Dr. S. M. Toha', dept: 'Cardiology', time: '15m ago', status: 'Active' },
                { name: 'Tahmina Akhter', doctor: 'Dr. Imran Hossain', dept: 'Neurology', time: '40m ago', status: 'Active' },
                { name: 'Zubair Mahmud', doctor: 'Dr. Zahid Hasan', dept: 'Ophthalmology', time: '1h ago', status: 'Active' },
                { name: 'Sadia Farhana', doctor: 'Dr. Selina Hossain', dept: 'Gastroenterology', time: '2h ago', status: 'Active' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold text-xs">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Assigned: {item.doctor} ({item.dept})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">{item.time}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Desk Support */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Desk Quick Operations
            </h4>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start text-xs rounded-xl h-10 border-slate-200">
                <Link href="/patients?action=create">
                  <UserPlus className="h-4 w-4 mr-2 text-teal-600" />
                  Register New Patient
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-xs rounded-xl h-10 border-slate-200">
                <Link href="/doctors">
                  <Stethoscope className="h-4 w-4 mr-2 text-sky-600" />
                  Check On-Duty Doctors
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-xs rounded-xl h-10 border-slate-200">
                <Link href="/patients?status=Critical">
                  <AlertCircle className="h-4 w-4 mr-2 text-rose-600" />
                  View High Priority Wards
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
