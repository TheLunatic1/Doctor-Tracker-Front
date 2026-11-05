'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  Stethoscope,
  Plus,
  Search,
  FilterX,
  Eye,
  Trash2,
  Edit2,
  Star,
  Building2,
  UserCheck,
  TrendingUp,
  LayoutGrid,
  List as ListIcon,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/shared/Pagination';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import DoctorFormModal from '@/features/doctors/DoctorFormModal';
import { useDoctors, useDeleteDoctor } from '@/features/doctors/useDoctors';
import { useDebounce } from '@/hooks/useDebounce';
import { Doctor } from '@/types';
import { cn } from '@/lib/utils';

const SPECIALIZATIONS = [
  'All Specializations',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Oncology',
  'Gynecology',
  'Psychiatry',
  'Ophthalmology',
  'Gastroenterology',
  'Endocrinology',
];

const HOSPITALS = [
  'All Hospitals',
  'Apollo Hospital',
  'City Health Hospital',
  'National Medical Center',
  'Care Medical Center',
  'Skin Care Hospital',
  'Health Plus Hospital',
  'Square Hospital',
  'United Hospital',
  'Evercare Hospital',
  'Central Hospital',
];

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [specialization, setSpecialization] = useState('All Specializations');
  const [hospital, setHospital] = useState('All Hospitals');
  const [dateRange, setDateRange] = useState('any');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  // Calculate dateFrom based on quick date filter
  let dateFrom: string | undefined;
  if (dateRange === '30d') {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dateFrom = d.toISOString();
  } else if (dateRange === 'month') {
    const d = new Date();
    d.setDate(1);
    dateFrom = d.toISOString();
  }

  const { data, isLoading } = useDoctors({
    page,
    limit: 8,
    search: debouncedSearch,
    specialization: specialization === 'All Specializations' ? undefined : specialization,
    hospital: hospital === 'All Hospitals' ? undefined : hospital,
    dateFrom,
  });

  const deleteMutation = useDeleteDoctor();

  const handleClearFilters = () => {
    setSearchInput('');
    setSpecialization('All Specializations');
    setHospital('All Hospitals');
    setDateRange('any');
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: doctorToDelete._id, cascade: true });
      setDoctorToDelete(null);
      if (selectedDoctor?._id === doctorToDelete._id) {
        setSelectedDoctor(null);
      }
    } catch {
      // toast shown in mutation
    }
  };

  const getSpecialtyBadge = (spec: string) => {
    switch (spec) {
      case 'Cardiology':
        return <Badge variant="destructive">❤️ {spec}</Badge>;
      case 'Neurology':
        return <Badge variant="blue">🧠 {spec}</Badge>;
      case 'Pediatrics':
        return <Badge variant="success">👶 {spec}</Badge>;
      case 'Orthopedics':
        return <Badge variant="purple">🦴 {spec}</Badge>;
      case 'Dermatology':
        return <Badge variant="warning">🔥 {spec}</Badge>;
      default:
        return <Badge variant="default">🩺 {spec}</Badge>;
    }
  };

  const doctorsList = data?.data || [];
  const meta = data?.meta;

  return (
    <AppShell title="Doctors" subtitle="Manage and view all registered doctors in the system.">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm shadow-sky-600/10">
            <Stethoscope className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Doctors</h2>
            <p className="text-xs text-slate-500">Manage and view all registered doctors in the system.</p>
          </div>
        </div>

        <Button
          onClick={() => {
            setDoctorToEdit(null);
            setIsCreateOpen(true);
          }}
          variant="primary"
          className="gap-2 shadow-md shadow-sky-600/20 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Top 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Doctors</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{meta?.total || 48}</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +8.2% from last month
          </p>
        </Card>

        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Doctors</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {doctorsList.filter((d) => d.status === 'Active').length || 46}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +6.1% active capacity
          </p>
        </Card>

        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">This Month</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">12</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +20.0% new onboards
          </p>
        </Card>

        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Top Hospital</p>
              <p className="text-sm font-bold text-slate-900 truncate mt-0.5">City Health Hospital ★</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Highest patient rating</p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search doctors..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                icon={<Search className="h-4 w-4" />}
                className="h-10 text-xs"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            {/* Hospital Filter */}
            <select
              value={hospital}
              onChange={(e) => {
                setHospital(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {HOSPITALS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="any">Any Date</option>
              <option value="month">This Month</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Clear Filters */}
            {(searchInput || specialization !== 'All Specializations' || hospital !== 'All Hospitals' || dateRange !== 'any') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <FilterX className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Grid / Table Toggle */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'rounded-lg p-1.5 text-slate-500 hover:text-slate-900 transition-colors',
                viewMode === 'table' ? 'bg-white shadow-sm text-sky-600 font-semibold' : ''
              )}
              title="Table view"
              aria-label="Table view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-lg p-1.5 text-slate-500 hover:text-slate-900 transition-colors',
                viewMode === 'grid' ? 'bg-white shadow-sm text-sky-600 font-semibold' : ''
              )}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Main Content Area: List + Quick View Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Doctors Table / Cards Column */}
        <div className={cn(selectedDoctor ? 'lg:col-span-8' : 'lg:col-span-12', 'transition-all space-y-4')}>
          <Card className="border-slate-100 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : doctorsList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No doctors found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No registered doctors match your current search and filter criteria. Try clearing filters.
                </p>
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2 text-xs">
                  Reset All Filters
                </Button>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Doctor</th>
                      <th className="py-3 px-4">Specialization</th>
                      <th className="py-3 px-4">Hospital</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Phone</th>
                      <th className="py-3 px-4 hidden md:table-cell">Email</th>
                      <th className="py-3 px-4">Patients</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {doctorsList.map((doc, idx) => (
                      <tr
                        key={doc._id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={cn(
                          'hover:bg-sky-50/40 cursor-pointer transition-colors',
                          selectedDoctor?._id === doc._id ? 'bg-sky-50/80 font-medium' : ''
                        )}
                      >
                        <td className="py-3.5 px-4 text-slate-400 font-medium">
                          {(page - 1) * 8 + idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 font-bold text-xs ring-2 ring-sky-200">
                              {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{doc.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{doc.qualification || 'MBBS, MD'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{getSpecialtyBadge(doc.specialization)}</td>
                        <td className="py-3.5 px-4 text-slate-600">{doc.hospital}</td>
                        <td className="py-3.5 px-4 text-slate-600 hidden sm:table-cell">{doc.phone}</td>
                        <td className="py-3.5 px-4 text-slate-500 hidden md:table-cell">{doc.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 text-sm">
                            {doc.patientCount ?? 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0" title="View details">
                              <Link href={`/doctors/${doc._id}`}>
                                <Eye className="h-4 w-4 text-slate-500 hover:text-sky-600" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Edit profile"
                              onClick={() => {
                                setDoctorToEdit(doc);
                                setIsCreateOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4 text-slate-500 hover:text-sky-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                              title="Delete doctor"
                              onClick={() => setDoctorToDelete(doc)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {doctorsList.map((doc) => (
                  <Card
                    key={doc._id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={cn(
                      'p-4 border-slate-100 hover:border-sky-300 transition-all cursor-pointer space-y-3',
                      selectedDoctor?._id === doc._id ? 'border-sky-500 shadow-sm' : ''
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 font-bold text-sm ring-2 ring-sky-200">
                          {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.qualification || 'MBBS, MD'}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {doc.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      {getSpecialtyBadge(doc.specialization)}
                      <span className="text-slate-500 font-medium">{doc.hospital}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                      <span>
                        Patients: <strong className="text-slate-900 font-bold">{doc.patientCount || 0}</strong>
                      </span>
                      <Button asChild variant="link" size="sm" className="h-auto p-0 text-sky-600 text-xs">
                        <Link href={`/doctors/${doc._id}`}>Profile →</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination meta={meta} onPageChange={(p) => setPage(p)} entityName="doctors" />
          </Card>
        </div>

        {/* Right Side Quick-View Doctor Details Panel */}
        {selectedDoctor && (
          <div className="lg:col-span-4 sticky top-24">
            <Card className="border-slate-100 shadow-md p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Doctor Quick View
                </span>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ Close
                </button>
              </div>

              <div className="text-center space-y-2">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-extrabold text-2xl shadow-lg shadow-sky-500/20 ring-4 ring-sky-50">
                  {selectedDoctor.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{selectedDoctor.name}</h3>
                <p className="text-xs text-sky-700 font-semibold">{selectedDoctor.specialization}</p>
                <p className="text-xs text-slate-400">{selectedDoctor.qualification}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-xs text-slate-500">Total Patients</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedDoctor.patientCount || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {selectedDoctor.rating || 4.8}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedDoctor.hospital}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{selectedDoctor.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedDoctor.email}</span>
                </div>
              </div>

              <Button asChild variant="primary" className="w-full gap-2 rounded-xl">
                <Link href={`/doctors/${selectedDoctor._id}`}>
                  View Full Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Doctor Form Modal (Create / Edit) */}
      <DoctorFormModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        doctorToEdit={doctorToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!doctorToDelete}
        onOpenChange={(open) => !open && setDoctorToDelete(null)}
        title="Delete Doctor Profile"
        description={`Are you sure you want to delete ${doctorToDelete?.name}? This will also safely remove or cascade their assigned patients.`}
        confirmLabel="Delete Doctor"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </AppShell>
  );
}
