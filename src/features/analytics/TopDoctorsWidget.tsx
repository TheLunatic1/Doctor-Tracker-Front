'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientsPerDoctor } from './useAnalytics';
import { cn } from '@/lib/utils';

export default function TopDoctorsWidget() {
  const { data: topDoctors, isLoading } = usePatientsPerDoctor(5);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-amber-100 text-amber-800 ring-2 ring-amber-200';
    if (rank === 2) return 'bg-slate-200 text-slate-800 ring-2 ring-slate-300';
    if (rank === 3) return 'bg-amber-50 text-amber-900 border border-amber-300';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <Card className="border-slate-100 shadow-sm col-span-1 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top Doctors
        </CardTitle>
        <Link
          href="/doctors"
          className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 group"
        >
          View all
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : !topDoctors || topDoctors.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No doctors available
          </div>
        ) : (
          <div className="space-y-2.5">
            {topDoctors.map((doc, idx) => (
              <Link
                key={doc._id}
                href={`/doctors/${doc._id}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                      getRankBadge(idx + 1)
                    )}
                  >
                    {idx + 1}
                  </div>

                  {doc.avatar ? (
                    <Image
                      src={doc.avatar}
                      alt={doc.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-sky-200"
                      unoptimized={doc.avatar.startsWith('data:')}
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 font-bold text-xs ring-2 ring-sky-200">
                      {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {doc.specialization}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-extrabold text-slate-900">
                    {doc.patientCount}
                  </span>
                  <p className="text-[10px] text-slate-400">Patients</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
