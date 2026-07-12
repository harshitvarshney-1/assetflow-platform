import React from 'react';
import { AssetStatus, AllocationStatus, TransferStatus } from '../types';

interface StatusBadgeProps {
  status: AssetStatus | AllocationStatus | TransferStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bg = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status === 'AVAILABLE') {
    bg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (status === 'ALLOCATED') {
    bg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  } else if (status === 'RESERVED') {
    bg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else if (status === 'UNDER_MAINTENANCE') {
    bg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (status === 'LOST') {
    bg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (status === 'RETIRED' || status === 'DISPOSED') {
    bg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  if (status === 'PENDING' || status === 'REQUESTED') {
    bg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (status === 'APPROVED' || status === 'COMPLETED' || status === 'RETURNED') {
    bg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (status === 'REJECTED' || status === 'CANCELLED') {
    bg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
