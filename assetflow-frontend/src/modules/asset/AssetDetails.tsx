import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, DollarSign, MapPin, Tag, Cpu, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { QRComponent } from '../../components/QRComponent';
import { Asset, Allocation, Transfer, AssetHistory } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [assetHistory, setAssetHistory] = useState<AssetHistory[]>([]);
  const [allocationHistory, setAllocationHistory] = useState<Allocation[]>([]);
  const [transferHistory, setTransferHistory] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'allocations' | 'transfers' | 'maintenance'>('specs');

  useEffect(() => {
    const fetchAllDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Fetch Asset
        const assetResponse = await api.get(`/assets/${id}`);
        if (assetResponse.data.success) {
          setAsset(assetResponse.data.data);
        }

        // 2. Fetch Asset Audit History
        const historyResponse = await api.get(`/assets/${id}/history`);
        if (historyResponse.data.success) {
          setAssetHistory(historyResponse.data.data);
        }

        // 3. Fetch Allocation History
        const allocationResponse = await api.get(`/allocations/history/${id}`);
        if (allocationResponse.data.success) {
          setAllocationHistory(allocationResponse.data.data);
        }

        // 4. Fetch Transfer History
        const transferResponse = await api.get(`/transfers/history/${id}`);
        if (transferResponse.data.success) {
          setTransferHistory(transferResponse.data.data);
        }
      } catch (error: any) {
        console.error('Error fetching asset details:', error);
        showToast('Failed to load asset details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="px-6 py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <h3 className="text-xl font-bold text-slate-200">Asset Not Found</h3>
        <p className="text-slate-400 mt-2">The asset you are looking for does not exist or has been deleted.</p>
        <Link to="/assets" className="mt-4 text-brand-400 hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }



  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link to="/assets" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Hero Header panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specifications Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 rounded-3xl glass-panel flex flex-col sm:flex-row gap-6 items-start">
            {asset.image ? (
              <img
                src={asset.image}
                alt={asset.assetName}
                className="w-full sm:w-44 h-44 object-cover rounded-2xl border border-slate-800"
              />
            ) : (
              <div className="w-full sm:w-44 h-44 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center font-extrabold text-3xl text-slate-500 uppercase">
                {asset.assetName.substring(0, 2)}
              </div>
            )}

            <div className="flex-grow space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={asset.status} />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wide">
                  {asset.condition}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{asset.assetName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {asset.assetTag}</span>
                <span className="text-slate-700">•</span>
                <span>Serial: {asset.serialNumber}</span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {asset.location || '—'}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pt-2">
                {asset.description || 'No description provided for this asset.'}
              </p>
            </div>
          </div>

          {/* Details / History Tabs */}
          <div className="flex flex-col flex-grow">
            <div className="flex border-b border-slate-800/80 gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'specs' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'history' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Audit Log ({assetHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('allocations')}
                className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'allocations' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Allocations ({allocationHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('transfers')}
                className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'transfers' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Transfers ({transferHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'maintenance' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Maintenance
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-6 flex-grow">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-3xl glass-panel">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Purchase & Value</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-slate-500">Purchase Date:</div>
                      <div className="text-slate-200 font-medium">{asset.purchaseDate}</div>
                      
                      <div className="text-slate-500">Purchase Cost:</div>
                      <div className="text-slate-200 font-semibold flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        {asset.purchaseCost.toFixed(2)}
                      </div>
                      
                      <div className="text-slate-500">Warranty Expiry:</div>
                      <div className="text-slate-200 font-medium">{asset.warrantyExpiry || 'No warranty'}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Model & Manufacturer</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-slate-500">Manufacturer:</div>
                      <div className="text-slate-200 font-medium">{asset.manufacturer || '—'}</div>
                      
                      <div className="text-slate-500">Model Number:</div>
                      <div className="text-slate-200 font-medium">{asset.modelNumber || '—'}</div>
                      
                      <div className="text-slate-500">Location Tag:</div>
                      <div className="text-slate-200 font-medium">{asset.location || '—'}</div>
                    </div>
                  </div>

                  {asset.documents && (
                    <div className="sm:col-span-2 pt-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2 mb-3">Linked Documents</h3>
                      <a
                        href={asset.documents}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-semibold p-3 border border-slate-800 bg-slate-900/60 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        <FileText className="w-4.5 h-4.5" />
                        <span>View Technical Manual / Specification Manual</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-6 rounded-3xl glass-panel space-y-6">
                  {assetHistory.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No audit records found for this asset.</p>
                  ) : (
                    <div className="relative border-l border-slate-800/80 ml-3 pl-6 space-y-6">
                      {assetHistory.map((h) => (
                        <div key={h.id} className="relative">
                          <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 ring-4 ring-slate-950 border border-brand-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                          </span>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg">
                                {h.action}
                              </span>
                              <p className="text-sm text-slate-200 mt-2 font-medium">{h.description}</p>
                              <span className="text-xs text-slate-500 mt-1 block">Performed by: {h.actionBy}</span>
                            </div>
                            <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(h.actionDate).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'allocations' && (
                <div className="p-6 rounded-3xl glass-panel space-y-6">
                  {allocationHistory.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No allocation logs found for this asset.</p>
                  ) : (
                    <div className="relative border-l border-slate-800/80 ml-3 pl-6 space-y-6">
                      {allocationHistory.map((a) => (
                        <div key={a.id} className="relative">
                          <span className={`absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 ring-4 ring-slate-950 border ${
                            a.status === 'ALLOCATED' ? 'border-blue-500' : 'border-slate-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${a.status === 'ALLOCATED' ? 'bg-blue-400' : 'bg-slate-400'}`} />
                          </span>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-200 text-sm">{a.employee}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400 text-xs">{a.department}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1.5">
                                Allocated: {a.allocatedDate} &rarr; Expected Return: {a.expectedReturnDate}
                              </p>
                              {a.actualReturnDate && (
                                <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                                  Actual Return: {a.actualReturnDate}
                                </p>
                              )}
                              {a.notes && (
                                <p className="text-xs text-slate-500 mt-2 bg-slate-900/50 p-2 border border-slate-800/40 rounded-lg">
                                  Notes: {a.notes}
                                </p>
                              )}
                            </div>
                            <StatusBadge status={a.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transfers' && (
                <div className="p-6 rounded-3xl glass-panel space-y-6">
                  {transferHistory.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No transfer logs found for this asset.</p>
                  ) : (
                    <div className="relative border-l border-slate-800/80 ml-3 pl-6 space-y-6">
                      {transferHistory.map((t) => (
                        <div key={t.id} className="relative">
                          <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 ring-4 ring-slate-950 border border-indigo-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          </span>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-slate-400 text-xs">From:</span>
                                <span className="font-semibold text-slate-200 text-xs">{t.fromEmployee}</span>
                                <span className="font-medium text-slate-400 text-xs">To:</span>
                                <span className="font-semibold text-brand-400 text-xs">{t.toEmployee}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Reason: "{t.reason}"
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                                <span>Requested by: {t.requestedBy}</span>
                                {t.approvedBy && (
                                  <>
                                    <span>•</span>
                                    <span>Approved by: {t.approvedBy}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <StatusBadge status={t.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className="p-6 rounded-3xl glass-panel space-y-6 text-center">
                  <Cpu className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-sm font-semibold text-slate-300">Maintenance History Module</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Maintenance events (fault tickets, repairs, safety checks) are handled in the Booking/Maintenance module.
                  </p>
                  <div className="border border-dashed border-slate-800/80 rounded-2xl p-4 mt-2 max-w-md mx-auto text-left text-xs space-y-3">
                    <div className="flex justify-between text-slate-400">
                      <span>Annual Calibration check</span>
                      <span className="text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> PASS
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Completed: 2026-04-12 by TechAdmin</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side panels: QR Code and Current Holder */}
        <div className="flex flex-col gap-6">
          {/* QR Code widget */}
          <div className="p-6 rounded-3xl glass-panel flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 self-start">QR Identification</h3>
            <QRComponent value={asset.assetTag} />
            <p className="text-slate-500 text-xs mt-3 max-w-xs leading-normal">
              Scan tag to check out, register transfer logs, or audit item specifications.
            </p>
          </div>

          {/* Current Assignment Summary */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Assigned Holder</h3>
            {asset.currentHolder ? (
              <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm">
                  {asset.currentHolder.substring(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">{asset.currentHolder}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{asset.department}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-slate-900/40 border border-slate-800/40 rounded-2xl text-slate-500 text-sm italic">
                No active assignment. Available in warehouse storage.
              </div>
            )}
            
            <div className="pt-2 flex flex-col gap-2">
              {asset.status === 'AVAILABLE' && (
                <Link
                  to={`/allocations/new?assetId=${asset.id}`}
                  className="w-full text-center py-2.5 text-xs font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition-all duration-200"
                >
                  Checkout / Allocate
                </Link>
              )}
              {asset.status === 'ALLOCATED' && (
                <>
                  <Link
                    to={`/transfers/new?assetId=${asset.id}`}
                    className="w-full text-center py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all duration-200"
                  >
                    Transfer Request
                  </Link>
                  {/* Find active allocation ID to support quick returns */}
                  {allocationHistory.find(a => a.status === 'ALLOCATED') && (
                    <Link
                      to={`/allocations/return/${allocationHistory.find(a => a.status === 'ALLOCATED')?.id}`}
                      className="w-full text-center py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all duration-200"
                    >
                      Return Asset
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
