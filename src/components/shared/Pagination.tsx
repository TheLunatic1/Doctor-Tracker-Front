import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationMeta } from '@/types';
import { cn } from '@/lib/utils';

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  entityName?: string;
}

export default function Pagination({
  meta,
  onPageChange,
  entityName = 'records',
}: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, limit, total, totalPages, hasNext, hasPrev } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate visible page numbers
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <p className="text-xs sm:text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">{start}</span>–
        <span className="font-semibold text-slate-800">{end}</span> of{' '}
        <span className="font-semibold text-slate-800">{total}</span> {entityName}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          aria-label="Previous page"
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                p === page
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              )}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-1 text-slate-400 text-xs">
              ...
            </span>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Next page"
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
