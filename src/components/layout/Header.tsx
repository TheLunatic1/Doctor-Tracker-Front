'use client';

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
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Patient Admission',
    message: 'Kazi Nazrul Islam admitted under Dr. S. M. Toha in Cardiology.',
    time: '10m ago',
    read: false,
    type: 'admission',
  },
  {
    id: 'notif-2',
    title: 'Physician Duty Update',
    message: 'Dr. Sarah Ahmed updated emergency on-call schedule for City Health Hospital.',
    time: '45m ago',
    read: false,
    type: 'schedule',
  },
  {
    id: 'notif-3',
    title: 'Clinical Milestone',
    message: 'Monthly patient care plans reached 500+ across all active departments.',
    time: '2h ago',
    read: false,
    type: 'milestone',
  },
  {
    id: 'notif-4',
    title: 'Rehabilitation Update',
    message: 'Dr. Imran Hossain completed stroke recovery assessment for Tahmina Uddin.',
    time: '5h ago',
    read: true,
    type: 'admission',
  },
  {
    id: 'notif-5',
    title: 'System Health Check',
    message: 'Database compound indexes verified with 100% IXSCAN execution plans.',
    time: '1d ago',
    read: true,
    type: 'alert',
  },
];

export default function Header({ onMenuToggle, title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/90 px-4 md:px-8 backdrop-blur-md">
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

      <div className="flex items-center gap-4">
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
          <button
            onClick={() => {
              setIsUserMenuOpen((prev) => !prev);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border-l border-slate-200 pl-3"
            aria-label="User account menu"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-800 font-bold text-xs ring-2 ring-sky-200">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Super Admin'}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* User Popover Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@doctortracker.com'}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <Shield className="h-3 w-3" />
                  Authenticated Admin
                </span>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  Dashboard
                </Link>
                <Link
                  href="/doctors"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Users className="h-4 w-4 text-slate-500" />
                  Doctors Directory
                </Link>
                <Link
                  href="/patients"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  Patients Roster
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
        </div>
      </div>
    </header>
  );
}
