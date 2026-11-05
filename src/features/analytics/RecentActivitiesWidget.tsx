'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentActivities } from './useAnalytics';

export default function RecentActivitiesWidget() {
  const { data, isLoading } = useRecentActivities();
  const recentDoctors = data?.recentDoctors || [];

  return (
    <Card className="border-slate-100 shadow-sm col-span-1 lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-sky-600" />
          Recently Added Doctors
        </CardTitle>
        <Link
          href="/doctors"
          className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 group"
        >
          View all doctors
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : recentDoctors.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No doctors registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2 px-3">Doctor</th>
                  <th className="py-2 px-3">Specialization</th>
                  <th className="py-2 px-3">Hospital</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDoctors.slice(0, 4).map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <Link
                        href={`/doctors/${doc._id}`}
                        className="flex items-center gap-2.5 font-semibold text-slate-900 hover:text-sky-600 group"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                          {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate">{doc.name}</span>
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant="default" className="text-[10px]">
                        {doc.specialization}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                      {doc.hospital}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
