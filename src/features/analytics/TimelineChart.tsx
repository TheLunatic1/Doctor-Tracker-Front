'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTimeline } from './useAnalytics';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineChartProps {
  range?: string;
}

export default function TimelineChart({ range = '6m' }: TimelineChartProps) {
  const [mounted, setMounted] = useState(false);
  const [groupBy, setGroupBy] = useState<'month' | 'day'>('month');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: timelineData, isLoading } = useTimeline(range, groupBy);

  return (
    <Card className="border-slate-100 shadow-sm col-span-1 lg:col-span-8">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            Patient Overview
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Patient registrations over time (zero-filled continuous series)
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" /> +18.6% vs last period
          </span>

          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setGroupBy('month')}
              className={cn(
                'rounded-lg px-2.5 py-1 font-semibold transition-all',
                groupBy === 'month'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setGroupBy('day')}
              className={cn(
                'rounded-lg px-2.5 py-1 font-semibold transition-all',
                groupBy === 'day'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Daily
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!mounted || isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        ) : !timelineData || timelineData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-xs text-slate-400">
            No patient records in this date range
          </div>
        ) : (
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg text-xs">
                          <p className="font-semibold text-slate-900">
                            {payload[0].payload.label}
                          </p>
                          <p className="text-sky-600 font-bold mt-1">
                            {payload[0].value} New Patients
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#patientGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
