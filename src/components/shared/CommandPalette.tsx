'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Stethoscope,
  Users,
  BarChart3,
  LayoutDashboard,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  Command,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import api from '@/lib/api';
import { Doctor, Patient } from '@/types';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTriggerNewDoctor?: () => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
  onTriggerNewDoctor,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Live search results from API
  const [doctorResults, setDoctorResults] = useState<Doctor[]>([]);
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Navigation items
  const staticNavigation = useMemo(
    () => [
      {
        id: 'nav-dash',
        category: 'Navigation',
        title: 'Dashboard Overview',
        subtitle: 'Key clinic statistics, trends, and top performers',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
      {
        id: 'nav-docs',
        category: 'Navigation',
        title: 'Doctors Directory',
        subtitle: 'Browse, filter, and manage registered doctors',
        icon: Stethoscope,
        href: '/doctors',
      },
      {
        id: 'nav-pats',
        category: 'Navigation',
        title: 'Patients Roster',
        subtitle: 'View admitted patients and medical conditions',
        icon: Users,
        href: '/patients',
      },
      {
        id: 'nav-stats',
        category: 'Navigation',
        title: 'Clinical Analytics',
        subtitle: 'Admission breakdown and hospital distributions',
        icon: BarChart3,
        href: '/analytics',
      },
      {
        id: 'nav-prof',
        category: 'Navigation',
        title: 'Profile & Settings',
        subtitle: 'Admin credentials and session management',
        icon: User,
        href: '/profile',
      },
    ],
    []
  );

  // Quick Action items
  const staticActions = useMemo(
    () => [
      {
        id: 'act-new-doc',
        category: 'Quick Actions',
        title: 'Register New Doctor',
        subtitle: 'Open the clinical onboarding modal',
        icon: Plus,
        action: () => {
          onOpenChange(false);
          if (onTriggerNewDoctor) {
            onTriggerNewDoctor();
          } else {
            router.push('/doctors?action=create');
          }
        },
      },
      {
        id: 'act-view-active',
        category: 'Quick Actions',
        title: 'Filter Active Doctors Only',
        subtitle: 'Jump to doctors currently on duty',
        icon: Activity,
        href: '/doctors?status=Active',
      },
      {
        id: 'act-view-critical',
        category: 'Quick Actions',
        title: 'View Critical Patients',
        subtitle: 'Review high-priority patient admissions',
        icon: Users,
        href: '/patients?status=Critical',
      },
    ],
    [onOpenChange, onTriggerNewDoctor, router]
  );

  // Fetch doctors and patients matching query
  useEffect(() => {
    if (!open) {
      setQuery('');
      setDoctorResults([]);
      setPatientResults([]);
      setSelectedIndex(0);
      return;
    }

    if (query.trim().length === 0) {
      setDoctorResults([]);
      setPatientResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const [docRes, patRes] = await Promise.all([
          api.get(`/doctors?search=${encodeURIComponent(query)}&limit=4`),
          api.get(`/patients?search=${encodeURIComponent(query)}&limit=4`),
        ]);

        if (docRes.data?.data) {
          setDoctorResults(docRes.data.data);
        }
        if (patRes.data?.data) {
          setPatientResults(patRes.data.data);
        }
      } catch {
        // quiet fallback
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, open]);

  // Combined flat list for keyboard navigation
  const allItems = useMemo(() => {
    const q = query.toLowerCase().trim();

    const filteredNav = staticNavigation.filter(
      (n) => n.title.toLowerCase().includes(q) || n.subtitle.toLowerCase().includes(q)
    );

    const filteredActions = staticActions.filter(
      (a) => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );

    return [
      ...filteredNav.map((item) => ({ ...item, type: 'nav' as const })),
      ...filteredActions.map((item) => ({ ...item, type: 'action' as const })),
      ...doctorResults.map((doc) => ({
        id: `doc-${doc._id}`,
        category: 'Doctors',
        title: doc.name,
        subtitle: `${doc.specialization} • ${doc.hospital}`,
        doctor: doc,
        type: 'doctor' as const,
        href: `/doctors/${doc._id}`,
      })),
      ...patientResults.map((pat) => ({
        id: `pat-${pat._id}`,
        category: 'Patients',
        title: pat.name,
        subtitle: `Condition: ${pat.condition} • Status: ${pat.status}`,
        patient: pat,
        type: 'patient' as const,
        href: `/patients?search=${encodeURIComponent(pat.name)}`,
      })),
    ];
  }, [query, staticNavigation, staticActions, doctorResults, patientResults]);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [allItems.length]);

  const handleSelect = useCallback(
    (item: (typeof allItems)[0]) => {
      onOpenChange(false);
      if (item.type === 'action' && 'action' in item && item.action) {
        item.action();
      } else if ('href' in item && item.href) {
        router.push(item.href);
      }
    },
    [onOpenChange, router]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (allItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = allItems[selectedIndex];
        if (item) {
          handleSelect(item);
        }
      }
    },
    [allItems, selectedIndex, handleSelect]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-xl max-h-[85vh] flex flex-col bg-white border border-slate-200/90 shadow-2xl rounded-2xl">
        <DialogTitle className="sr-only">Spotlight Command Palette</DialogTitle>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="h-5 w-5 text-sky-600 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search doctors, patients, pages, or quick actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200/60"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 max-h-[60vh]">
          {allItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No results found</p>
              <p className="text-xs text-slate-400">
                Try searching by doctor name, specialty, or clinical condition
              </p>
            </div>
          ) : (
            <div>
              {allItems.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Icon or Avatar */}
                      {item.type === 'doctor' ? (
                        item.doctor.avatar ? (
                          <Image
                            src={item.doctor.avatar}
                            alt={item.doctor.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/50"
                            unoptimized={item.doctor.avatar.startsWith('data:')}
                          />
                        ) : (
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            {item.doctor.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                          </div>
                        )
                      ) : item.type === 'patient' ? (
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          <Users className="h-4 w-4" />
                        </div>
                      ) : (
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {'icon' in item && item.icon && <item.icon className="h-4 w-4" />}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isSelected ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {item.title}
                          </p>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate ${
                            isSelected ? 'text-sky-100' : 'text-slate-500'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right pill */}
                    {item.type === 'doctor' && (
                      <div className="shrink-0 text-right">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-sky-50 text-sky-700 border border-sky-100'
                          }`}
                        >
                          {item.doctor.patientCount ?? 0} patients
                        </span>
                      </div>
                    )}

                    {isSelected && (
                      <ArrowRight className="h-4 w-4 shrink-0 text-white animate-in slide-in-from-left-1 duration-150" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold text-slate-600 shadow-2xs">
                ↑
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold text-slate-600 shadow-2xs">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold text-slate-600 shadow-2xs">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Command className="h-3.5 w-3.5" />
            <span>Doctor Tracker Spotlight</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
