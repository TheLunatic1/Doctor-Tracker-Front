'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  Check,
  Trash2,
  Users,
  Calendar,
  AlertCircle,
  TrendingUp,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Search,
  Command,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import CommandPalette from '@/components/shared/CommandPalette';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'admission' | 'schedule' | 'alert' | 'milestone';
}

const ROLE_NOTIFICATIONS: Record<string, NotificationItem[]> = {
  patient: [
    {
      id: 'notif-p1',
      title: 'Prescription Refill Approved',
      message: 'Dr. S. M. Toha approved your Cardiocare prescription and updated follow-up instructions.',
      time: '15m ago',
      read: false,
      type: 'admission',
    },
    {
      id: 'notif-p2',
      title: 'Lab Results Ready',
      message: 'Your routine Blood Pressure and Lipid Panel was reviewed and filed by Pathology.',
      time: '1h ago',
      read: false,
      type: 'milestone',
    },
    {
      id: 'notif-p3',
      title: 'Attending Physician Rounds',
      message: 'Dr. S. M. Toha is scheduled for inpatient rounds at Apollo Hospital Room 402 at 10:00 AM.',
      time: '3h ago',
      read: false,
      type: 'schedule',
    },
    {
      id: 'notif-p4',
      title: 'Vitals Logged Successfully',
      message: 'Morning blood pressure reading (120/80 mmHg) successfully recorded in your portal.',
      time: '6h ago',
      read: true,
      type: 'alert',
    },
    {
      id: 'notif-p5',
      title: 'Cardiovascular Care Milestone',
      message: 'Completed Week 2 of rehabilitation therapy with stable clinical recovery markers.',
      time: '1d ago',
      read: true,
      type: 'milestone',
    },
  ],
  doctor: [
    {
      id: 'notif-d1',
      title: 'Patient Vitals Alert',
      message: 'New vitals recorded for Kazi Nazrul Islam: BP 120/80 mmHg, SpO2 98%, HR 72 bpm.',
      time: '10m ago',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-d2',
      title: 'Ward Rounds Reminder',
      message: 'Cardiology Inpatient Ward Block B rounds scheduled at 09:00 AM (8 patients).',
      time: '45m ago',
      read: false,
      type: 'schedule',
    },
    {
      id: 'notif-d3',
      title: 'Clinical Consultation Request',
      message: 'Neurology Department requested cardiology co-management consultation for Room 304.',
      time: '2h ago',
      read: false,
      type: 'admission',
    },
    {
      id: 'notif-d4',
      title: 'Diagnostic Lab Alert',
      message: 'Urgent Troponin and serial ECG reports uploaded for Patient #KA-001 review.',
      time: '5h ago',
      read: true,
      type: 'alert',
    },
    {
      id: 'notif-d5',
      title: 'Discharge Protocol Ready',
      message: 'Tahmina Uddin stroke recovery discharge protocol ready for attending physician sign-off.',
      time: '1d ago',
      read: true,
      type: 'milestone',
    },
  ],
  staff: [
    {
      id: 'notif-s1',
      title: 'New Patient Intake Completed',
      message: 'Admissions Desk processed emergency intake registration for incoming cardiology patient.',
      time: '15m ago',
      read: false,
      type: 'admission',
    },
    {
      id: 'notif-s2',
      title: 'Bed Availability Alert',
      message: 'Cardiology Ward Block B currently at 85% capacity (4 beds remaining in general observation).',
      time: '40m ago',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-s3',
      title: 'Physician Duty Update',
      message: 'Dr. Sarah Ahmed updated emergency on-call schedule for City Health Hospital.',
      time: '2h ago',
      read: false,
      type: 'schedule',
    },
    {
      id: 'notif-s4',
      title: 'Patient Transfer Notice',
      message: 'Patient Kazi Nazrul Islam transferred from Emergency triage to Ward 402, Bed 3.',
      time: '4h ago',
      read: true,
      type: 'admission',
    },
    {
      id: 'notif-s5',
      title: 'Shift Handover Logged',
      message: 'Morning clinical nursing handover completed with 0 pending incident reports.',
      time: '1d ago',
      read: true,
      type: 'milestone',
    },
  ],
  admin: [
    {
      id: 'notif-a1',
      title: 'Executive System Backup',
      message: 'Automated MongoDB database snapshot and audit log backup verified successfully.',
      time: '20m ago',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-a2',
      title: 'Physician Registry Sync',
      message: '48 hospital specialists verified with current BMDC and board credentials.',
      time: '1h ago',
      read: false,
      type: 'admission',
    },
    {
      id: 'notif-a3',
      title: 'Monthly Clinical Milestone',
      message: 'Monthly patient care plans reached 500+ across all active hospital departments.',
      time: '2h ago',
      read: false,
      type: 'milestone',
    },
    {
      id: 'notif-a4',
      title: 'Infrastructure Diagnostics',
      message: 'API response latency averaged 24ms with 100% database query cache hit rate.',
      time: '6h ago',
      read: true,
      type: 'alert',
    },
    {
      id: 'notif-a5',
      title: 'Security Audit Summary',
      message: 'Zero anomalous login attempts or role escalation breaches in the past 7 days.',
      time: '1d ago',
      read: true,
      type: 'milestone',
    },
  ],
};

export default function Header({ onMenuToggle, title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const role = user?.role || 'admin';
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load role-scoped notifications
  useEffect(() => {
    const defaultList = ROLE_NOTIFICATIONS[role] || ROLE_NOTIFICATIONS.admin;
    try {
      const storageKey = `dt_notifs_${role}_${user?.id || 'guest'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotifications(JSON.parse(saved));
        return;
      }
    } catch {
      // ignore
    }
    setNotifications(defaultList);
  }, [role, user?.id]);

  // Persist notifications on change
  const persistNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    try {
      const storageKey = `dt_notifs_${role}_${user?.id || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global Ctrl+K / Cmd+K shortcut listener for Spotlight search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(updated);
  };

  const clearAllNotifications = () => {
    persistNotifications([]);
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'admission':
        return <Users className="h-4 w-4 text-sky-600" />;
      case 'schedule':
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'milestone':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/90 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Spotlight Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-all shadow-2xs group"
          title="Spotlight Search (Ctrl + K)"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
          <span className="font-medium">Search or jump to...</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs">
            Ctrl K
          </kbd>
        </button>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Spotlight Search"
          title="Spotlight Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Interactive Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen((prev) => !prev);
              setIsUserMenuOpen(false);
            }}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isNotifOpen
                ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-1">
                    <Bell className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">No notifications right now</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !item.read ? 'bg-sky-50/40' : ''
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 mt-0.5">
                        {getNotifIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-semibold truncate ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                      {!item.read && (
                        <div className="h-2 w-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">{notifications.length} alerts in log</span>
                  <button
                    onClick={clearAllNotifications}
                    className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Badge with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          {(() => {
            const avatarUrl = user?.avatar || user?.doctorProfile?.avatar;
            const roleLabel =
              role === 'doctor'
                ? 'Doctor'
                : role === 'patient'
                ? 'Patient'
                : role === 'staff'
                ? 'Hospital Staff'
                : 'Administrator';

            return (
              <>
                <button
                  onClick={() => {
                    setIsUserMenuOpen((prev) => !prev);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border-l border-slate-200 pl-3"
                  aria-label="User account menu"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'User'}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-200 shadow-2xs"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-800 font-bold text-xs ring-2 ring-sky-200">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800">{user?.name || 'User'}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{roleLabel}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
                </button>

                {/* User Popover Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                      <div className="flex items-center gap-2.5">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={user?.name || 'User'}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-800 font-bold text-xs shrink-0">
                            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@doctortracker.com'}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 mt-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        <Shield className="h-3 w-3" />
                        Authenticated {roleLabel}
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 text-slate-500" />
                        {role === 'patient'
                          ? 'My Care Portal'
                          : role === 'doctor'
                          ? 'Practice Hub'
                          : role === 'staff'
                          ? 'Admissions Desk'
                          : 'Dashboard'}
                      </Link>

                      {(role === 'admin' || role === 'staff') && (
                        <>
                          <Link
                            href="/doctors"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Users className="h-4 w-4 text-slate-500" />
                            {role === 'staff' ? 'On-Duty Doctors' : 'Doctors Directory'}
                          </Link>
                          <Link
                            href="/patients"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <User className="h-4 w-4 text-slate-500" />
                            {role === 'staff' ? 'Patient Roster' : 'Patients Roster'}
                          </Link>
                        </>
                      )}

                      {role === 'doctor' && (
                        <>
                          <Link
                            href="/patients"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <User className="h-4 w-4 text-slate-500" />
                            My Patients
                          </Link>
                          <Link
                            href="/doctors"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Users className="h-4 w-4 text-slate-500" />
                            Physicians Directory
                          </Link>
                        </>
                      )}

                      {role === 'patient' && (
                        <Link
                          href="/doctors"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Users className="h-4 w-4 text-slate-500" />
                          My Doctor
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        Profile & Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 p-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </header>

    <CommandPalette
      open={isCommandPaletteOpen}
      onOpenChange={setIsCommandPaletteOpen}
    />
  </>
);
}
