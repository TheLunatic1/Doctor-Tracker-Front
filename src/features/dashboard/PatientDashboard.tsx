'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Stethoscope,
  Building2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { User } from '@/types';

interface PatientDashboardProps {
  user: User;
}

export default function PatientDashboard({ user }: PatientDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-600 to-blue-700 p-6 md:p-8 text-white shadow-lg shadow-sky-600/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Patient Care Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Access your clinical admission details, attending physician contact, and personalized health summary.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              asChild
              variant="secondary"
              className="bg-white text-sky-700 hover:bg-sky-50 shadow-sm rounded-xl font-semibold text-xs"
            >
              <Link href="/doctors">
                <Stethoscope className="h-4 w-4 mr-1.5" />
                View My Doctor
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-semibold"
            >
              <Link href="/profile">
                My Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Record (MRN)</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">KNI0001</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Verified Hospital ID</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Care Status</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">Active</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2">Under physician care</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Condition</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">Hypertension</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Cardiology Department</p>
        </Card>

        <Card className="p-4 border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Admitted Date</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Oct 15, 2026</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Regular follow-ups</p>
        </Card>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attending Physician Card */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attending Physician
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                On Duty
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-xl flex items-center justify-center ring-4 ring-sky-50 shadow-md">
                ST
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-slate-900">Dr. S. M. Toha</h4>
                <p className="text-xs font-semibold text-sky-600">Senior Clinical Cardiologist</p>
                <p className="text-xs text-slate-400 mt-0.5">Apollo Hospital • 15+ years experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
                <Building2 className="h-4 w-4 text-sky-600 shrink-0" />
                <span className="truncate">Apollo Hospital, Main Wing</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>+880 1711 998877</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 sm:col-span-2">
                <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="truncate">toha.cardio@apollo.com</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Clinical Care Plan & Notes */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Care Plan & Clinical Notes
              </span>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>

            <div className="rounded-2xl bg-sky-50/60 p-4 border border-sky-100/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <AlertCircle className="h-4 w-4 text-sky-600" />
                Current Medical Directive
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Active clinical observation for blood pressure stabilization. Continue daily low-sodium dietary plan and maintain regular blood pressure log. Next scheduled review is set with the cardiology desk.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-900">Hospital Desk Support</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need to reschedule an appointment or report new symptoms? Contact the Apollo Hospital desk at <strong>+880 1711 998877</strong> or reach out to clinic staff coordinator.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
