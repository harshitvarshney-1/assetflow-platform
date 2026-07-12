import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Calendar, User, Briefcase, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { Asset } from '../../types';

const allocationFormSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  employee: z.string().min(1, 'Employee name is required'),
  department: z.string().min(1, 'Department is required'),
  allocatedDate: z.string().min(1, 'Allocation date is required'),
  expectedReturnDate: z.string().min(1, 'Expected return date is required'),
  notes: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.allocatedDate && data.expectedReturnDate) {
    return new Date(data.expectedReturnDate) >= new Date(data.allocatedDate);
  }
  return true;
}, {
  message: 'Expected return date cannot be before allocation date',
  path: ['expectedReturnDate'],
});

type AllocationFormValues = z.infer<typeof allocationFormSchema>;

export const AllocationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const queryAssetId = searchParams.get('assetId');
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [assetsLoading, setAssetsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationFormSchema),
    defaultValues: {
      allocatedDate: new Date().toISOString().substring(0, 10),
      expectedReturnDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // default 90 days
      assetId: queryAssetId || '',
      notes: '',
    },
  });

  useEffect(() => {
    const fetchAssets = async () => {
      setAssetsLoading(true);
      try {
        if (queryAssetId) {
          // Preloaded single asset case
          const response = await api.get(`/assets/${queryAssetId}`);
          if (response.data.success) {
            setAvailableAssets([response.data.data]);
            setValue('assetId', queryAssetId);
          }
        } else {
          // General list checkout
          const response = await api.get('/assets', {
            params: { status: 'AVAILABLE', page: 0, size: 100 },
          });
          if (response.data.success) {
            setAvailableAssets(response.data.data.content || []);
          }
        }
      } catch (error) {
        showToast('Failed to fetch available assets', 'error');
      } finally {
        setAssetsLoading(false);
      }
    };
    fetchAssets();
  }, [queryAssetId, setValue, showToast]);

  const onSubmit = async (values: AllocationFormValues) => {
    setLoading(true);
    try {
      const response = await api.post('/allocations', values);
      if (response.data.success) {
        showToast('Asset allocated successfully', 'success');
        navigate(`/assets/${values.assetId}`);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to allocate asset', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (assetsLoading) {
    return (
      <div className="px-6 py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Back to details */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Asset Checkout</h1>
          <p className="text-slate-400 text-xs mt-0.5">Assign an available asset to a specific team member.</p>
        </div>
      </div>

      {/* Allocation form */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel border border-slate-800/80 rounded-3xl p-6 md:p-8 max-w-3xl space-y-8">
        
        {/* SELECT ASSET */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Target Asset</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset to Assign *</label>
            <select
              {...register('assetId')}
              disabled={!!queryAssetId}
              className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none disabled:opacity-60"
            >
              <option value="">Select an available asset</option>
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.assetName} ({asset.assetTag}) - S/N: {asset.serialNumber}
                </option>
              ))}
            </select>
            {errors.assetId && (
              <p className="text-rose-500 text-xs mt-1">{errors.assetId.message}</p>
            )}
            {availableAssets.length === 0 && !queryAssetId && (
              <p className="text-amber-500 text-xs mt-2 italic">No assets are currently AVAILABLE for allocation.</p>
            )}
          </div>
        </div>

        {/* RECIPIENT */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Recipient Employee</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employee Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe..."
                  {...register('employee')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.employee && (
                <p className="text-rose-500 text-xs mt-1">{errors.employee.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  {...register('department')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              {errors.department && (
                <p className="text-rose-500 text-xs mt-1">{errors.department.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Checkout Period</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Allocation Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  {...register('allocatedDate')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.allocatedDate && (
                <p className="text-rose-500 text-xs mt-1">{errors.allocatedDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expected Return Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  {...register('expectedReturnDate')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.expectedReturnDate && (
                <p className="text-rose-500 text-xs mt-1">{errors.expectedReturnDate.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assignment Notes</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                placeholder="Include key details, accessories supplied (charger, cables) or checks done..."
                rows={3}
                {...register('notes')}
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
            disabled={loading || (availableAssets.length === 0 && !queryAssetId)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Complete Allocation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
