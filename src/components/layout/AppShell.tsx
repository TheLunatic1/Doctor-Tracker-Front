'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

// Global persistent state across client page navigations
let globalIsHovered = false;
let globalIsClickedOpen = false;

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(() => globalIsHovered || globalIsClickedOpen);
  const [isClickedOpen, setIsClickedOpen] = useState(() => globalIsClickedOpen);

  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        globalIsHovered = true;
        enterTimerRef.current = null;
      }, 180); // Smooth intent delay
    }
  };

  const handleSidebarClick = () => {
    // When clicking inside the sidebar, keep it open until the cursor leaves its bounds
    setIsClickedOpen(true);
    globalIsClickedOpen = true;
    setIsHovered(true);
    globalIsHovered = true;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isCollapsed) return;
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    // Verify whether cursor has truly left the sidebar bounding box
    const el = sidebarContainerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (isInside) return;
    }

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsClickedOpen(false);
      globalIsHovered = false;
      globalIsClickedOpen = false;
      leaveTimerRef.current = null;
    }, 240); // Grace period: keeps sidebar open until cursor is fully out of bounds
  };

  // Global mousemove tracker: ensures sidebar stays open after clicking
  // and closes only when cursor is completely outside its bounding box
  useEffect(() => {
    if (!isCollapsed || (!isHovered && !isClickedOpen)) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const el = sidebarContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) {
        if (!leaveTimerRef.current) {
          leaveTimerRef.current = setTimeout(() => {
            setIsHovered(false);
            setIsClickedOpen(false);
            globalIsHovered = false;
            globalIsClickedOpen = false;
            leaveTimerRef.current = null;
          }, 240);
        }
      } else {
        if (leaveTimerRef.current) {
          clearTimeout(leaveTimerRef.current);
          leaveTimerRef.current = null;
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isCollapsed, isHovered, isClickedOpen]);

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
    setIsClickedOpen(false);
    globalIsHovered = false;
    globalIsClickedOpen = false;
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

  const isExpandedDesktop = !isCollapsed || isHovered || isClickedOpen;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/70">
      {/* Desktop Sidebar Rail with Hover & Click Expansion */}
      <div
        className={cn(
          'hidden md:block shrink-0 transition-all duration-300 ease-out relative',
          isCollapsed ? (isExpandedDesktop ? 'w-64 z-50' : 'w-20 z-40') : 'w-64 z-40'
        )}
      >
        <div
          ref={sidebarContainerRef}
          onClick={handleSidebarClick}
          className={cn(
            'fixed top-0 bottom-0 left-0 transition-all duration-300 ease-out z-50 flex flex-col bg-[#0b1329]',
            isCollapsed
              ? isExpandedDesktop
                ? 'w-64 shadow-2xl shadow-slate-950/70 ring-1 ring-slate-800'
                : 'w-20'
              : 'w-64'
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            isHovered={isHovered || isClickedOpen}
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
