import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="relative inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Page <span className="font-semibold text-slate-200">{currentPage + 1}</span> of{' '}
            <span className="font-semibold text-slate-200">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-l-md px-2.5 py-2 text-slate-400 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {[...Array(totalPages)].map((_, idx) => {
              const active = idx === currentPage;
              return (
                <button
                  key={idx}
                  onClick={() => onPageChange(idx)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                    active
                      ? 'z-10 bg-brand-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'
                      : 'text-slate-300 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 focus:outline-offset-0'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="relative inline-flex items-center rounded-r-md px-2.5 py-2 text-slate-400 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
