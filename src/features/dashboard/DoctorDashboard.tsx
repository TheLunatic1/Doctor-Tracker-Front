'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Stethoscope,
  Building2,
  Star,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { User } from '@/types';
import { useDoctorPatients } from '@/features/doctors/useDoctors';

interface DoctorDashboardProps {
  user: User;
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  // Use Dr. S. M. Toha's doctor ID or default to first doctor
  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 md:p-8 text-white shadow-lg shadow-slate-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
              <Stethoscope className="h-3.5 w-3.5" />
              Physician Practice Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Department of Cardiology • Apollo Hospital • Manage your assigned patients and daily clinical flow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="primary"
              className="bg-sky-500 hover:bg-sky-400 text-white shadow-md rounded-xl font-semibold text-xs"
            >
              <Link href="/patients">
                <Users className="h-4 w-4 mr-1.5" />
                View My Patients
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Doctor Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">My Active Patients</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">14</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Optimal patient ratio
          </p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Department</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5 truncate">Cardiology</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Preventive Care</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Primary Facility</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">Apollo Hospital</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Main Cardiovascular Wing</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Physician Rating</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">4.9 ★</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">From 48 reviews</p>
        </Card>
      </div>

      {/* Roster & Quick Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today&apos;s Active Patients</h3>
                <p className="text-xs text-slate-400">Under direct observation in Cardiology</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-sky-600 hover:text-sky-700">
                <Link href="/patients">View Full Roster →</Link>
              </Button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { name: 'Kazi Nazrul Islam', mrn: 'KNI0001', condition: 'Hypertension', time: '10:30 AM', status: 'Active' },
                { name: 'Fatema Begum', mrn: 'FB0012', condition: 'Arrhythmia Follow-up', time: '11:15 AM', status: 'Active' },
                { name: 'Rafiqul Chowdhury', mrn: 'RC0023', condition: 'Post-Op Monitoring', time: '02:00 PM', status: 'Active' },
                { name: 'Amina Khatun', mrn: 'AK0034', condition: 'Coronary Checkup', time: '03:45 PM', status: 'Active' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-bold text-xs">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.mrn} • {p.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">{p.time}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Schedule Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clinic Duty Schedule
              </span>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-900">Morning Rounds</p>
                <p className="text-[11px] text-slate-500">09:00 AM – 01:00 PM • Apollo Main Ward</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-900">Outpatient Consultation</p>
                <p className="text-[11px] text-slate-500">02:00 PM – 06:00 PM • Room 402</p>
              </div>
              <div className="rounded-xl bg-sky-50/70 p-3 border border-sky-100 space-y-1">
                <p className="text-xs font-bold text-sky-900">Emergency On-Call Duty</p>
                <p className="text-[11px] text-sky-700">Cardiology Response Team • Active</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
