'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const enterTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('doctor_tracker_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  const handleMouseEnter = () => {
    if (!isCollapsed) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (!isHovered && !enterTimerRef.current) {
      enterTimerRef.current = setTimeout(() => {
        setIsHovered(true);
        enterTimerRef.current = null;
      }, 220); // Deliberate intent delay: prevents jitter on passing mouse
    }
  };

  const handleMouseLeave = () => {
    if (!isCollapsed) return;
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      leaveTimerRef.current = null;
    }, 320); // Grace period: keeps sidebar open if cursor briefly crosses border
  };

  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const toggleCollapse = () => {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setIsHovered(false);
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('doctor_tracker_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/70">
      {/* Desktop Sidebar Rail with Hover Expansion */}
      <div
        className={cn(
          'hidden md:block shrink-0 transition-all duration-300 ease-out relative',
          isCollapsed ? (isHovered ? 'w-64 z-50' : 'w-20 z-40') : 'w-64 z-40'
        )}
      >
        <div
          className={cn(
            'fixed top-0 bottom-0 left-0 transition-all duration-300 ease-out z-50 flex flex-col bg-[#0b1329]',
            isCollapsed
              ? isHovered
                ? 'w-64 shadow-2xl shadow-slate-950/70 ring-1 ring-slate-800'
                : 'w-20'
              : 'w-64'
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            isHovered={isHovered}
            onToggleCollapse={toggleCollapse}
          />
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setMobileOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
