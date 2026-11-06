'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import AdminDashboard from '@/features/dashboard/AdminDashboard';
import DoctorDashboard from '@/features/dashboard/DoctorDashboard';
import StaffDashboard from '@/features/dashboard/StaffDashboard';
import PatientDashboard from '@/features/dashboard/PatientDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <AppShell title="Dashboard" subtitle="Workspace / Overview">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  const roleTitles = {
    admin: { title: 'Executive Overview', subtitle: 'Clinic Operations & Analytics' },
    doctor: { title: 'Physician Practice', subtitle: 'Assigned Patients & Clinical Flow' },
    staff: { title: 'Admissions Desk', subtitle: 'Patient Intake & Ward Coordination' },
    patient: { title: 'My Health Portal', subtitle: 'Personal Care Plan & Attending Doctor' },
  };

  const currentRole = user.role || 'admin';
  const roleMeta = roleTitles[currentRole] || roleTitles.admin;

  return (
    <AppShell title={roleMeta.title} subtitle={roleMeta.subtitle}>
      {currentRole === 'doctor' ? (
        <DoctorDashboard user={user} />
      ) : currentRole === 'staff' ? (
        <StaffDashboard user={user} />
      ) : currentRole === 'patient' ? (
        <PatientDashboard user={user} />
      ) : (
        <AdminDashboard user={user} />
      )}
    </AppShell>
  );
}
