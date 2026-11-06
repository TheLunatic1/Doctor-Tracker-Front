'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  BarChart3,
  User,
  LogOut,
  Activity,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  isHovered?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  onClose,
  isCollapsed = false,
  isHovered = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Expanded if not collapsed OR when hovering over the collapsed sidebar
  const isExpanded = !isCollapsed || isHovered;

  const role = user?.role || 'admin';

  const navItems = [
    {
      title:
        role === 'patient'
          ? 'My Care Portal'
          : role === 'doctor'
          ? 'Practice Hub'
          : role === 'staff'
          ? 'Admissions Desk'
          : 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
  ];

  if (role === 'admin') {
    navItems.push(
      {
        title: 'Doctors',
        href: '/doctors',
        icon: Stethoscope,
        active: pathname.startsWith('/doctors'),
      },
      {
        title: 'Patients',
        href: '/patients',
        icon: Users,
        active: pathname.startsWith('/patients'),
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        active: pathname === '/analytics',
      }
    );
  } else if (role === 'doctor') {
    navItems.push(
      {
        title: 'My Patients',
        href: '/patients',
        icon: Users,
        active: pathname.startsWith('/patients'),
      },
      {
        title: 'Physicians Directory',
        href: '/doctors',
        icon: Stethoscope,
        active: pathname.startsWith('/doctors'),
      }
    );
  } else if (role === 'staff') {
    navItems.push(
      {
        title: 'Patient Roster',
        href: '/patients',
        icon: Users,
        active: pathname.startsWith('/patients'),
      },
      {
        title: 'On-Duty Doctors',
        href: '/doctors',
        icon: Stethoscope,
        active: pathname.startsWith('/doctors'),
      }
    );
  } else if (role === 'patient') {
    navItems.push({
      title: 'My Doctor',
      href: '/doctors',
      icon: Stethoscope,
      active: pathname.startsWith('/doctors'),
    });
  }

  navItems.push({
    title: 'Profile & Settings',
    href: '/profile',
    icon: User,
    active: pathname === '/profile',
  });

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-[#0b1329] text-white transition-all duration-300 ease-in-out select-none',
        isExpanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-slate-800 transition-all duration-300 bg-[#0b1329]',
          isExpanded ? 'justify-between px-5' : 'justify-center px-2'
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-3 font-bold text-lg tracking-tight group"
          title="Doctor Tracker"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </div>
          {isExpanded && (
            <span className="text-white font-semibold whitespace-nowrap animate-in fade-in duration-200">
              Doctor <span className="text-sky-400">Tracker</span>
            </span>
          )}
        </Link>

        {/* Mobile Close X button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Desktop Collapse / Expand Pin Toggle Button */}
        {!onClose && onToggleCollapse && isExpanded && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? 'Pin Sidebar Open' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Pin Sidebar Open' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-sky-400" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {isExpanded ? (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap animate-in fade-in duration-200">
            Core Navigation
          </div>
        ) : (
          <div className="h-2" />
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={!isExpanded ? item.title : undefined}
              className={cn(
                'group flex items-center rounded-xl transition-all duration-200',
                isExpanded
                  ? 'gap-3.5 px-3.5 py-3 text-sm font-medium'
                  : 'justify-center h-11 w-11 mx-auto',
                item.active
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-900/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                  item.active ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                )}
              />
              {isExpanded && (
                <span className="truncate whitespace-nowrap animate-in fade-in duration-200">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="border-t border-slate-800/80 p-3">
        {(() => {
          const avatarUrl = user?.avatar || user?.doctorProfile?.avatar;

          if (isExpanded) {
            return (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/60 p-2.5 border border-slate-800 animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'User'}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-sky-500/30"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs ring-2 ring-sky-500/30">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="truncate text-[11px] text-slate-400 capitalize">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            );
          }

          return (
            <div className="flex flex-col items-center gap-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'User'}
                  className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-sky-500/30 cursor-pointer hover:ring-sky-400 transition-all"
                  title={`${user?.name || 'Admin'} (${user?.role || 'Admin'})`}
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 font-bold text-xs ring-2 ring-sky-500/30 cursor-pointer hover:ring-sky-400 transition-all"
                  title={`${user?.name || 'Admin'} (${user?.role || 'Admin'})`}
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
              )}
              <button
                onClick={() => logout()}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}
