'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Users,
  Plus,
  Search,
  FilterX,
  Trash2,
  Edit2,
  Calendar,
  Heart,
  TrendingUp,
  UserCheck,
  LayoutGrid,
  List as ListIcon,
  Phone,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/shared/Pagination';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PatientFormModal from '@/features/patients/PatientFormModal';
import { usePatients, useDeletePatient } from '@/features/patients/usePatients';
import { useDoctors } from '@/features/doctors/useDoctors';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, cn } from '@/lib/utils';
import { Patient, Doctor } from '@/types';

const CONDITIONS = [
  'All Conditions',
  'Cardiology',
  'Hypertension',
  'Neurology',
  'Migraine',
  'Pediatrics',
  'Orthopedics',
  'Osteoarthritis',
  'Dermatology',
  'General Checkup',
  'Type 2 Diabetes',
  'Oncology',
  'Gynecology',
];

export default function PatientsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  const canAddPatient = user?.role === 'admin' || user?.role === 'staff' || user?.role === 'doctor';

  useEffect(() => {
    // Redirect patients to their dedicated personal care portal
    if (user && user.role === 'patient') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [condition, setCondition] = useState('All Conditions');
  const [selectedDoctorId, setSelectedDoctorId] = useState('all');
  const [dateRange, setDateRange] = useState('any');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  let sortParam = 'newest';
  if (sortField === 'createdAt') {
    sortParam = sortOrder === 'asc' ? 'oldest' : 'newest';
  } else if (sortField === 'name') {
    sortParam = sortOrder === 'asc' ? 'name_asc' : 'name_desc';
  } else if (sortField === 'age') {
    sortParam = sortOrder === 'asc' ? 'age_asc' : 'age_desc';
  } else if (sortField === 'condition') {
    sortParam = sortOrder === 'asc' ? 'condition_asc' : 'condition_desc';
  } else if (sortField === 'status') {
    sortParam = sortOrder === 'asc' ? 'status_asc' : 'status_desc';
  }

  // Fetch doctors for filter dropdown
  const { data: doctorsData } = useDoctors({ limit: 100 });
  const doctorsList = doctorsData?.data || [];

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

  const { data, isLoading } = usePatients({
    page,
    limit: 8,
    search: debouncedSearch,
    condition: condition === 'All Conditions' ? undefined : condition,
    doctorId: selectedDoctorId === 'all' ? undefined : selectedDoctorId,
    dateFrom,
    sort: sortParam,
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'createdAt' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="h-3 w-3 text-slate-300 opacity-60 group-hover:opacity-100 group-hover:text-slate-500 transition-all shrink-0" />
      );
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-sky-600 font-bold shrink-0 animate-in fade-in" />
    ) : (
      <ArrowDown className="h-3 w-3 text-sky-600 font-bold shrink-0 animate-in fade-in" />
    );
  };

  const deleteMutation = useDeletePatient();

  const handleClearFilters = () => {
    setSearchInput('');
    setCondition('All Conditions');
    setSelectedDoctorId('all');
    setDateRange('any');
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    try {
      await deleteMutation.mutateAsync(patientToDelete._id);
      setPatientToDelete(null);
    } catch {
      // toast shown in mutation
    }
  };

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case 'Cardiology':
      case 'Hypertension':
        return <Badge variant="destructive">❤️ {cond}</Badge>;
      case 'Neurology':
      case 'Migraine':
        return <Badge variant="blue">🧠 {cond}</Badge>;
      case 'Pediatrics':
        return <Badge variant="success">👶 {cond}</Badge>;
      case 'Orthopedics':
      case 'Osteoarthritis':
        return <Badge variant="purple">🦴 {cond}</Badge>;
      case 'Dermatology':
        return <Badge variant="warning">🔥 {cond}</Badge>;
      default:
        return <Badge variant="default">🩺 {cond}</Badge>;
    }
  };

  const patientsList = data?.data || [];
  const meta = data?.meta;
  const isDoctor = user?.role === 'doctor';
  const isStaff = user?.role === 'staff';

  const pageTitle = isDoctor
    ? 'My Assigned Patients'
    : isStaff
    ? 'Patient Roster'
    : 'Patients';

  const pageSubtitle = isDoctor
    ? `Clinical inpatient & outpatient roster for ${user?.name || 'Dr. S. M. Toha'}`
    : isStaff
    ? 'Hospital Admissions Desk & Active Inpatient Directory'
    : 'Manage and view all patients in the system.';

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm shadow-sky-600/10">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{pageTitle}</h2>
            <p className="text-xs text-slate-500">{pageSubtitle}</p>
          </div>
        </div>

        {canAddPatient && (
          <Button
            onClick={() => {
              setPatientToEdit(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            className="gap-2 shadow-md shadow-sky-600/20 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        )}
      </div>

      {/* Top 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isDoctor ? 'My Patients' : 'Total Patients'}
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {isDoctor ? (meta?.total ?? patientsList.length) : (meta?.total || 1284)}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> {isDoctor ? 'Assigned Clinical Load' : '+12.5% from last month'}
          </p>
        </Card>

        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isDoctor ? 'Department' : 'This Month'}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 truncate">
                {isDoctor ? 'Cardiology' : '246'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> {isDoctor ? 'Apollo Hospital' : '+8.3% monthly influx'}
          </p>
        </Card>

        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active In Care</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {isDoctor
                  ? (patientsList.filter((p) => p.status === 'Active').length || meta?.total || 1)
                  : '1,178'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> {isDoctor ? 'Under Regular Monitoring' : '+11.2% in active care'}
          </p>
        </Card>

        <Card className="p-4 border-slate-100 hover:border-slate-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isDoctor ? 'Today Rounds' : 'New This Month'}
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {isDoctor ? '1 Scheduled' : '112'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> {isDoctor ? 'Apollo East Wing' : '+16.7% vs previous'}
          </p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search patients..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                icon={<Search className="h-4 w-4" />}
                className="h-10 text-xs"
              />
            </div>

            {/* Condition Filter */}
            <select
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Doctors Filter */}
            {isDoctor ? (
              <div className="h-10 rounded-xl bg-sky-50 border border-sky-200 px-3 flex items-center gap-1.5 text-xs text-sky-800 font-semibold">
                <Stethoscope className="h-3.5 w-3.5 text-sky-600" />
                <span>Assigned: {user?.name || 'Dr. S. M. Toha'} (You)</span>
              </div>
            ) : (
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 max-w-[200px]"
              >
                <option value="all">All Doctors</option>
                {doctorsList.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            )}

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
            {(searchInput || condition !== 'All Conditions' || selectedDoctorId !== 'all' || dateRange !== 'any') && (
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

      {/* Main Table / Grid Area */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : patientsList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No patients found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No patient records match your current search and filter criteria. Try clearing your filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2 text-xs">
              Reset Filters
            </Button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th
                    onClick={() => handleSort('createdAt')}
                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group"
                    title="Click to sort by date / ID"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>#</span>
                      {renderSortIcon('createdAt')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group"
                    title="Click to sort by patient name"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Patient</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('age')}
                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group"
                    title="Click to sort by patient age"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Age</span>
                      {renderSortIcon('age')}
                    </div>
                  </th>
                  <th className="py-3 px-4">Gender</th>
                  <th
                    onClick={() => handleSort('condition')}
                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group"
                    title="Click to sort by condition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Condition</span>
                      {renderSortIcon('condition')}
                    </div>
                  </th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Registered On</th>
                  <th
                    onClick={() => handleSort('status')}
                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group"
                    title="Click to sort by status"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {renderSortIcon('status')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patientsList.map((p, idx) => {
                  const doc = typeof p.doctor === 'object' ? (p.doctor as Doctor) : null;
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        {(page - 1) * 8 + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-2 ring-slate-200">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                              {p.medicalRecordNumber || '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{p.age}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                            p.gender === 'Female'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          )}
                        >
                          {p.gender === 'Female' ? '♀ Female' : '♂ Male'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getConditionBadge(p.condition)}</td>
                      <td className="py-3.5 px-4">
                        {doc ? (
                          <Link
                            href={`/doctors/${doc._id}`}
                            className="flex items-center gap-2 hover:text-sky-600 transition-colors group"
                          >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                              {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800 group-hover:text-sky-600 truncate">
                              {doc.name}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 hidden sm:table-cell">
                        {formatDate(p.admittedAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            p.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'Critical'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              p.status === 'Active'
                                ? 'bg-emerald-500'
                                : p.status === 'Critical'
                                ? 'bg-rose-500'
                                : 'bg-slate-400'
                            )}
                          />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Edit patient"
                            onClick={() => {
                              setPatientToEdit(p);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4 text-slate-500 hover:text-sky-600" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                              title="Delete patient"
                              onClick={() => setPatientToDelete(p)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {patientsList.map((p) => {
              const doc = typeof p.doctor === 'object' ? (p.doctor as Doctor) : null;
              return (
                <Card key={p._id} className="p-4 border-slate-100 hover:border-slate-300 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 font-bold text-xs ring-2 ring-slate-200">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{p.medicalRecordNumber || '-'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    {getConditionBadge(p.condition)}
                    <span className="text-slate-500 font-medium">
                      {p.age} yrs • {p.gender}
                    </span>
                  </div>

                  {doc && (
                    <div className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <span className="text-slate-400">Doctor: </span>
                      <strong className="text-slate-800 font-semibold">{doc.name}</strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" /> {p.phone}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setPatientToEdit(p);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-rose-500"
                        onClick={() => setPatientToDelete(p)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Shared Pagination Controls */}
        <Pagination meta={meta} onPageChange={(p) => setPage(p)} entityName="patients" />
      </Card>

      {/* Patient Form Modal (Create or Edit) */}
      <PatientFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        patientToEdit={patientToEdit}
      />

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        open={!!patientToDelete}
        onOpenChange={(open) => !open && setPatientToDelete(null)}
        title="Delete Patient Record"
        description={`Are you sure you want to delete patient record '${patientToDelete?.name}' (${patientToDelete?.medicalRecordNumber || ''})? This action cannot be undone.`}
        confirmLabel="Delete Patient"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </AppShell>
  );
}
