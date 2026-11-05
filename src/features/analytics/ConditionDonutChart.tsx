'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useConditionDistribution } from './useAnalytics';

const COLORS = ['#0284c7', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b'];

interface ConditionDonutChartProps {
  totalPatients?: number;
}

export default function ConditionDonutChart({ totalPatients = 1284 }: ConditionDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: conditionsData, isLoading } = useConditionDistribution();

  const formattedData = (conditionsData || []).slice(0, 5).map((item, index) => ({
    name: item.condition,
    value: item.count,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="border-slate-100 shadow-sm col-span-1 lg:col-span-4 flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-900">
          Patient Distribution
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Breakdown by clinical condition
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center flex-1">
        {!mounted || isLoading ? (
          <Skeleton className="h-[260px] w-full rounded-2xl" />
        ) : formattedData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-xs text-slate-400">
            No condition distribution data
          </div>
        ) : (
          <div className="relative w-full flex flex-col items-center">
            {/* Donut Chart with center label */}
            <div className="relative h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-lg text-xs">
                            <p className="font-semibold text-slate-900">{payload[0].name}</p>
                            <p className="text-sky-600 font-bold">
                              {payload[0].value} patients ({payload[0].payload.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={formattedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {formattedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Total Patients in Center Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {totalPatients.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Total
                </span>
              </div>
            </div>

            {/* Legend with color dot, label, and % */}
            <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 mt-2">
              {formattedData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 ml-1">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
