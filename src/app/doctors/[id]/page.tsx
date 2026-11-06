'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppShell from '@/components/layout/AppShell';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Star,
  Plus,
  Users,
  Calendar,
  HeartHandshake,
  Trash2,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/shared/Pagination';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import AddPatientModal from '@/features/doctors/AddPatientModal';
import {
  useDoctor,
  useDoctorPatients,
  useDeleteDoctorPatient,
} from '@/features/doctors/useDoctors';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/lib/utils';
import { Patient } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const doctorId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'patients'>('overview');
  const [patientPage, setPatientPage] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const debouncedPatientSearch = useDebounce(patientSearch, 300);

  const { data: doctor, isLoading: isDoctorLoading } = useDoctor(doctorId);
  const { data: patientsResponse, isLoading: isPatientsLoading } = useDoctorPatients(doctorId, {
    page: patientPage,
    limit: 8,
    search: debouncedPatientSearch,
  });

  const deletePatientMutation = useDeleteDoctorPatient(doctorId);

  const handleDeletePatientConfirm = async () => {
    if (!patientToDelete) return;
    try {
      await deletePatientMutation.mutateAsync(patientToDelete._id);
      setPatientToDelete(null);
    } catch {
      // handled in mutation hook
    }
  };

  const patientsList = patientsResponse?.data || [];
  const meta = patientsResponse?.meta;

  if (isDoctorLoading) {
    return (
      <AppShell title="Doctor Profile">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!doctor) {
    return (
      <AppShell title="Doctor Not Found">
        <Card className="p-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h2>
          <p className="text-sm text-slate-500">
            The requested doctor ID does not exist or has been removed.
          </p>
          <Button asChild variant="primary">
            <Link href="/doctors">Back to Doctors</Link>
          </Button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={doctor.name} subtitle={`${doctor.specialization} at ${doctor.hospital}`}>
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl text-xs bg-white">
          <Link href="/doctors">
            <ArrowLeft className="h-4 w-4" />
            Back to Doctors
          </Link>
        </Button>

        <Button
          onClick={() => setIsAddPatientOpen(true)}
          variant="primary"
          size="sm"
          className="gap-2 rounded-xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Main Doctor Header Profile Card */}
      <Card className="overflow-hidden border-slate-100 shadow-sm bg-gradient-to-r from-white via-white to-sky-50/40 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {doctor.avatar ? (
                <Image
                  src={doctor.avatar}
                  alt={doctor.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-3xl object-cover shadow-xl shadow-sky-500/20 ring-4 ring-white"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-3xl shadow-xl shadow-sky-500/20 ring-4 ring-white">
                  {doctor.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.name}
                </h1>
                <Badge variant="blue" className="text-xs px-3 py-1 font-semibold">
                  {doctor.specialization}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                {doctor.bio || 'Experienced healthcare specialist dedicated to high quality clinical care and patient wellness.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  {doctor.hospital}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {doctor.phone}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {doctor.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics on Right Header */}
          <div className="flex items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 self-stretch sm:self-auto justify-around">
            <div className="text-center px-2">
              <p className="text-xs text-slate-400 font-medium">Total Patients</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{doctor.patientCount || 0}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <p className="text-xs text-slate-400 font-medium">Experience</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{doctor.yearsExperience || 5}+ yrs</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <p className="text-xs text-slate-400 font-medium">Rating</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {doctor.rating || 4.8}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'patients'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          Assigned Patients ({doctor.patientCount || 0})
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Doctor Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Patients</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{doctor.patientCount || 0}</p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-3">Active medical supervision</p>
            </Card>

            <Card className="p-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Monthly Visits</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">
                    {Math.min(28, (doctor.patientCount || 0) * 2)}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-3">Scheduled follow-ups</p>
            </Card>

            <Card className="p-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Doctor Rating</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{doctor.rating || 4.8}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-3">Verified patient reviews</p>
            </Card>

            <Card className="p-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Satisfaction</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">98%</p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-3">Excellent clinical care</p>
            </Card>
          </div>

          {/* Recent Patients Table & Profile Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <Card className="border-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Recent Patients</h3>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="text-xs text-sky-600 font-semibold hover:underline"
                  >
                    View All Patients →
                  </button>
                </div>

                {isPatientsLoading ? (
                  <div className="p-4 space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                ) : patientsList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No patients assigned to this doctor yet. Click &quot;Add Patient&quot; above to register one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-4">#</th>
                          <th className="py-2.5 px-4">Patient Name</th>
                          <th className="py-2.5 px-4">Age</th>
                          <th className="py-2.5 px-4">Gender</th>
                          <th className="py-2.5 px-4">Condition</th>
                          <th className="py-2.5 px-4">Admitted</th>
                          <th className="py-2.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patientsList.slice(0, 5).map((p, i) => (
                          <tr key={p._id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-4 text-slate-400">{i + 1}</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-800">{p.name}</td>
                            <td className="py-2.5 px-4 text-slate-600">{p.age}</td>
                            <td className="py-2.5 px-4 text-slate-600">{p.gender}</td>
                            <td className="py-2.5 px-4">
                              <Badge variant="default">{p.condition}</Badge>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500">{formatDate(p.admittedAt)}</td>
                            <td className="py-2.5 px-4">
                              <Badge variant={p.status === 'Active' ? 'success' : 'secondary'}>
                                {p.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            {/* Doctor Profile Info Column */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="border-slate-100 shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  Doctor Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-400">Specialization</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{doctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Hospital</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{doctor.hospital}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{doctor.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Email</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{doctor.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Qualification</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{doctor.qualification}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Registered On</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{formatDate(doctor.createdAt)}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setIsAddPatientOpen(true)}
                    variant="primary"
                    className="w-full gap-2 text-xs rounded-xl"
                  >
                    <Plus className="h-4 w-4" />
                    Add Patient under Doctor
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Patients Tab Content */}
      {activeTab === 'patients' && (
        <Card className="border-slate-100 overflow-hidden shadow-sm space-y-4">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search patients..."
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setPatientPage(1);
                }}
                icon={<Search className="h-4 w-4" />}
                className="h-10 text-xs"
              />
            </div>

            <Button
              onClick={() => setIsAddPatientOpen(true)}
              variant="primary"
              size="sm"
              className="gap-2 rounded-xl text-xs w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>

          {isPatientsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : patientsList.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No patients found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">MRN</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Admitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientsList.map((p, idx) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-400">
                        {(patientPage - 1) * 8 + idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{p.medicalRecordNumber || '-'}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.age} yrs • {p.gender}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{p.condition}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{p.phone}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(p.admittedAt)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={p.status === 'Active' ? 'success' : 'secondary'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                          title="Delete patient from doctor"
                          onClick={() => setPatientToDelete(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            meta={meta}
            onPageChange={(p) => setPatientPage(p)}
            entityName="patients"
          />
        </Card>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        open={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        doctorId={doctor._id}
        doctorName={doctor.name}
        defaultSpecialization={doctor.specialization}
      />

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        open={!!patientToDelete}
        onOpenChange={(open) => !open && setPatientToDelete(null)}
        title="Remove Patient"
        description={`Are you sure you want to remove patient '${patientToDelete?.name}' from ${doctor.name}'s care list?`}
        confirmLabel="Remove Patient"
        isLoading={deletePatientMutation.isPending}
        onConfirm={handleDeletePatientConfirm}
      />
    </AppShell>
  );
}
