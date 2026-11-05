'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTestPage() {
  const { user } = useAuth();

  return (
    <AppShell title="Dashboard" subtitle="Overview of your healthcare system">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Authenticated as: <strong className="text-sky-700">{user?.name || 'Administrator'}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
