import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, CornerDownLeft, Calendar, User, FileText } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { Allocation } from '../../types';

const returnFormSchema = z.object({
  returnDate: z.string().min(1, 'Return date is required'),
  returnedBy: z.string().min(1, 'Returned by name is required'),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']),
  remarks: z.string().optional().or(z.literal('')),
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

export const ReturnAssetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // allocationId
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      returnDate: new Date().toISOString().substring(0, 16), // datetime-local format: yyyy-MM-ddThh:mm
      condition: 'GOOD',
      remarks: '',
    },
  });

  useEffect(() => {
    const fetchAllocation = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/allocations/${id}`);
        if (response.data.success) {
          const alloc = response.data.data;
          setAllocation(alloc);
          reset({
            returnDate: new Date().toISOString().substring(0, 16),
            returnedBy: alloc.employee,
            condition: 'GOOD',
            remarks: '',
          });
        }
      } catch (error) {
        showToast('Failed to load allocation details', 'error');
        navigate('/assets');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAllocation();
  }, [id, reset, navigate, showToast]);

  const onSubmit = async (values: ReturnFormValues) => {
    setLoading(true);
    try {
      // Convert datetime-local string to ISO format for Spring Boot LocalDateTime parser
      const payload = {
        ...values,
        returnDate: new Date(values.returnDate).toISOString(),
      };
      
      const response = await api.post(`/allocations/${id}/return`, payload);
      if (response.data.success) {
        showToast('Asset returned and catalog status updated to AVAILABLE', 'success');
        if (allocation) {
          navigate(`/assets/${allocation.assetId}`);
        } else {
          navigate('/assets');
        }
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to complete return process', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="px-6 py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!allocation) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-200">Allocation Not Found</h3>
        <button onClick={() => navigate('/assets')} className="mt-4 text-brand-400">Back to Catalog</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Return Asset</h1>
          <p className="text-slate-400 text-xs mt-0.5">Record return specs and release the active device allocation.</p>
        </div>
      </div>

      {/* Allocation Summary Card */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 max-w-2xl flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Active Assignment Info</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Asset Name:</span> <span className="text-slate-200 font-semibold">{allocation.assetName} ({allocation.assetTag})</span></div>
          <div><span className="text-slate-500">Employee:</span> <span className="text-slate-200 font-semibold">{allocation.employee} ({allocation.department})</span></div>
          <div><span className="text-slate-500">Assigned:</span> <span className="text-slate-300 font-mono text-xs">{allocation.allocatedDate}</span></div>
          <div><span className="text-slate-500">Expected Return:</span> <span className="text-slate-300 font-mono text-xs">{allocation.expectedReturnDate}</span></div>
        </div>
      </div>

      {/* Return Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel border border-slate-800/80 rounded-3xl p-6 md:p-8 max-w-2xl space-y-8">
        
        {/* CHECK-IN INFO */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Return Specifics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Return Date/Time *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="datetime-local"
                  {...register('returnDate')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.returnDate && (
                <p className="text-rose-500 text-xs mt-1">{errors.returnDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Returned By *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Employee name..."
                  {...register('returnedBy')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.returnedBy && (
                <p className="text-rose-500 text-xs mt-1">{errors.returnedBy.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* DEVICE QUALITY CHECK */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Hardware Quality Check</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Returned Condition *</label>
            <select
              {...register('condition')}
              className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
            >
              <option value="NEW">New (Unopened/As New)</option>
              <option value="GOOD">Good (Working fine, normal wear)</option>
              <option value="FAIR">Fair (Scratches/Minor scuffs)</option>
              <option value="POOR">Poor (Functional issues)</option>
              <option value="DAMAGED">Damaged (Broken parts/Requires repair)</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Return Remarks / Log</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                placeholder="Describe return details (e.g. key scuffs, missing charger/box, or verified works fine)..."
                rows={3}
                {...register('remarks')}
                className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800/40 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-semibold text-slate-400 bg-slate-950 border border-slate-800/80 rounded-xl hover:bg-slate-900 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <CornerDownLeft className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Register Return'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
