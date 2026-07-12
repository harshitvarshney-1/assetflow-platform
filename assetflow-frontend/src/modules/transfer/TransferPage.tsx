import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, RefreshCw, Send, Check, X, FileText, ArrowRight, UserPlus } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Transfer, Asset } from '../../types';

const transferRequestSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  toEmployee: z.string().min(1, 'Destination employee is required'),
  reason: z.string().min(1, 'Reason for transfer is required'),
});

type TransferFormValues = z.infer<typeof transferRequestSchema>;

export const TransferPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const queryAssetId = searchParams.get('assetId');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [allocatedAssets, setAllocatedAssets] = useState<Asset[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferRequestSchema),
    defaultValues: {
      assetId: queryAssetId || '',
      toEmployee: '',
      reason: '',
    },
  });

  const fetchTransfers = async () => {
    setLoadingTransfers(true);
    try {
      const response = await api.get('/transfers');
      if (response.data.success) {
        setTransfers(response.data.data || []);
      }
    } catch (error) {
      showToast('Failed to fetch transfer requests', 'error');
    } finally {
      setLoadingTransfers(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [showToast]);

  useEffect(() => {
    const fetchAllocatedAssets = async () => {
      setLoadingAssets(true);
      try {
        if (queryAssetId) {
          const response = await api.get(`/assets/${queryAssetId}`);
          if (response.data.success) {
            setAllocatedAssets([response.data.data]);
            setValue('assetId', queryAssetId);
          }
        } else {
          const response = await api.get('/assets', {
            params: { status: 'ALLOCATED', page: 0, size: 100 },
          });
          if (response.data.success) {
            setAllocatedAssets(response.data.data.content || []);
          }
        }
      } catch (error) {
        showToast('Failed to load active allocated assets', 'error');
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAllocatedAssets();
  }, [queryAssetId, setValue, showToast]);

  const handleRequestSubmit = async (values: TransferFormValues) => {
    setSubmitting(true);
    try {
      const response = await api.post('/transfers', values);
      if (response.data.success) {
        showToast('Transfer request submitted successfully', 'success');
        reset({ assetId: '', toEmployee: '', reason: '' });
        fetchTransfers();
        if (queryAssetId) {
          navigate(`/assets/${queryAssetId}`);
        }
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to submit transfer request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (transferId: string, status: 'APPROVED' | 'REJECTED') => {
    setActioningId(transferId);
    try {
      const response = await api.put(`/transfers/${transferId}`, { status });
      if (response.data.success) {
        showToast(
          status === 'APPROVED'
            ? 'Transfer request approved! Asset holder and allocations updated.'
            : 'Transfer request rejected.',
          'success'
        );
        fetchTransfers();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to process transfer request', 'error');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/assets" className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Transfers Workflow</h1>
            <p className="text-slate-400 text-xs mt-0.5">Submit and process device assignments between team members.</p>
          </div>
        </div>
        <button
          onClick={fetchTransfers}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* NEW REQUEST FORM */}
        <div className="lg:col-span-1 glass-panel border border-slate-800/80 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Request Transfer</h3>
          
          <form onSubmit={handleSubmit(handleRequestSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset to Transfer *</label>
              <select
                {...register('assetId')}
                disabled={!!queryAssetId || loadingAssets}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none disabled:opacity-60"
              >
                <option value="">Select allocated asset</option>
                {allocatedAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.assetName} ({asset.assetTag}) - Current: {asset.currentHolder}
                  </option>
                ))}
              </select>
              {errors.assetId && (
                <p className="text-rose-500 text-xs mt-1">{errors.assetId.message}</p>
              )}
              {allocatedAssets.length === 0 && !queryAssetId && !loadingAssets && (
                <p className="text-amber-500 text-[10px] mt-1.5 italic">No assets are currently ALLOCATED to allow transfer requests.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Transfer To (Employee Name) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserPlus className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Bob..."
                  {...register('toEmployee')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.toEmployee && (
                <p className="text-rose-500 text-xs mt-1">{errors.toEmployee.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Transfer *</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-slate-500">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  placeholder="Explain transfer context (e.g. project Switch, remote onboarding)..."
                  rows={4}
                  {...register('reason')}
                  className="w-full text-sm rounded-xl glass-input pl-10 pr-4 py-3 text-slate-200 focus:outline-none"
                />
              </div>
              {errors.reason && (
                <p className="text-rose-500 text-xs mt-1">{errors.reason.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || (allocatedAssets.length === 0 && !queryAssetId)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
            >
              <Send className="w-4.5 h-4.5" />
              <span>{submitting ? 'Requesting...' : 'Request Transfer'}</span>
            </button>
          </form>
        </div>

        {/* TRANSFERS LISTING */}
        <div className="lg:col-span-2 glass-panel border border-slate-800/80 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Transfers Log</h3>
          
          {loadingTransfers ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : transfers.length === 0 ? (
            <p className="text-sm text-slate-500 italic text-center py-6">No transfer requests registered yet.</p>
          ) : (
            <div className="space-y-4">
              {transfers.map((t) => (
                <div key={t.id} className="p-4 border border-slate-800 bg-slate-950/20 rounded-2xl flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/40 pb-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200 text-sm">{t.assetName}</span>
                      <span className="font-mono text-[10px] text-slate-400 mt-0.5">{t.assetTag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(t.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">From Holder:</span>
                        <span className="font-semibold text-slate-300">{t.fromEmployee}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-500">To Holder:</span>
                        <span className="font-semibold text-brand-400">{t.toEmployee}</span>
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        "{t.reason}"
                      </p>
                      <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-1">
                        <span>Requested by: {t.requestedBy}</span>
                        {t.approvedBy && <span>Approved by: {t.approvedBy}</span>}
                      </div>
                    </div>

                    {/* Pending Request Action buttons */}
                    {t.status === 'REQUESTED' && (
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleAction(t.id, 'APPROVED')}
                          disabled={actioningId !== null}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors"
                          title="Approve and Complete Transfer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleAction(t.id, 'REJECTED')}
                          disabled={actioningId !== null}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
                          title="Reject Transfer Request"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
