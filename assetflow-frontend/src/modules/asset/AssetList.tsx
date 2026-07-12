import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileSpreadsheet, Download, RefreshCw, SlidersHorizontal, Trash2, Edit, Eye } from 'lucide-react';
import api from '../../services/api';
import { TableSkeleton } from '../../components/Skeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import { Asset, PaginatedResponse } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AssetList: React.FC = () => {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalElements] = useState(0);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');

  // Handle search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // Reset page on search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/assets';
      const params: Record<string, any> = {
        page,
        size: 10,
        sort: 'createdAt,desc',
      };

      if (debouncedSearch) {
        endpoint = '/assets/search';
        params.query = debouncedSearch;
      } else if (category || department || status || condition || location) {
        endpoint = '/assets/filter';
        if (category) params.category = category;
        if (department) params.department = department;
        if (status) params.status = status;
        if (condition) params.condition = condition;
        if (location) params.location = location;
      }

      const response = await api.get<any>(endpoint, { params });
      
      // Standard ApiResponse schema wrapping PaginatedResponse
      const apiData = response.data;
      if (apiData.success && apiData.data) {
        const paginated: PaginatedResponse<Asset> = apiData.data;
        setAssets(paginated.content || []);
        setTotalPages(paginated.totalPages || 1);
        setTotalElements(paginated.totalElements || 0);
      } else {
        setAssets([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (error: any) {
      console.error('Error fetching assets:', error);
      showToast(error.response?.data?.message || 'Failed to fetch assets', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, department, status, condition, location, showToast]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleDelete = async (id: string, tag: string) => {
    if (!window.confirm(`Are you sure you want to soft-delete asset ${tag}?`)) return;
    try {
      const response = await api.delete(`/assets/${id}`);
      if (response.data.success) {
        showToast(`Asset ${tag} deleted successfully`, 'success');
        fetchAssets();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete asset', 'error');
    }
  };

  const handleExport = async (type: 'csv' | 'excel') => {
    try {
      // Fetch all assets without pagination for full export
      const params = { page: 0, size: 1000, sort: 'createdAt,desc' };
      const response = await api.get('/assets', { params });
      const allAssets: Asset[] = response.data?.data?.content || assets;

      if (allAssets.length === 0) {
        showToast('No assets available to export', 'warning');
        return;
      }

      if (type === 'csv') {
        exportToCSV(allAssets);
        showToast('CSV export downloaded successfully', 'success');
      } else {
        await exportToExcel(allAssets);
        showToast('Excel export downloaded successfully', 'success');
      }
    } catch (error) {
      showToast('Export failed', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Upper header action list */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Asset Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track company physical and digital assets.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <Link
            to="/assets/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </Link>
        </div>
      </div>

      {/* Control panel containing Search Bar, filters trigger, refresh */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-grow">
            <SearchBar
              placeholder="Search by Asset Name, Tag, Serial Number, Department, Category, Status..."
              value={search}
              onChange={setSearch}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
              showFilters
                ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">Filters</span>
          </button>
          <button
            onClick={fetchAssets}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Panel dropdown */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-5 rounded-2xl glass-panel animate-slide-in">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                className="w-full text-sm rounded-xl glass-input p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Monitors">Monitors</option>
                <option value="Servers">Servers</option>
                <option value="Printers">Printers</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setPage(0); }}
                className="w-full text-sm rounded-xl glass-input p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(0); }}
                className="w-full text-sm rounded-xl glass-input p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="ALLOCATED">Allocated</option>
                <option value="RESERVED">Reserved</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="LOST">Lost</option>
                <option value="RETIRED">Retired</option>
                <option value="DISPOSED">Disposed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Condition</label>
              <select
                value={condition}
                onChange={(e) => { setCondition(e.target.value); setPage(0); }}
                className="w-full text-sm rounded-xl glass-input p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="">All Conditions</option>
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
                <option value="DAMAGED">Damaged</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
              <input
                type="text"
                placeholder="HQ..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(0); }}
                className="w-full text-sm rounded-xl glass-input p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid listing content */}
      <div className="flex-grow">
        {loading ? (
          <TableSkeleton />
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl border border-slate-800/80 text-center">
            <SlidersHorizontal className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-slate-200">No Assets Found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              We couldn't find any assets matching your search query or filter options.
            </p>
            {(search || category || department || status || condition || location) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  setDepartment('');
                  setStatus('');
                  setCondition('');
                  setLocation('');
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="glass-panel border border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800/80">
                  <tr>
                    <th scope="col" className="px-6 py-4">Asset Name</th>
                    <th scope="col" className="px-6 py-4">Asset Tag</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Department</th>
                    <th scope="col" className="px-6 py-4">Current Holder</th>
                    <th scope="col" className="px-6 py-4">Location</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-3">
                          {asset.image ? (
                            <img
                              src={asset.image}
                              alt={asset.assetName}
                              className="w-10 h-10 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-500 uppercase flex-shrink-0">
                              {asset.assetName.substring(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="text-slate-100 font-medium">{asset.assetName}</div>
                            <div className="text-slate-500 text-xs mt-0.5">S/N: {asset.serialNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{asset.assetTag}</td>
                      <td className="px-6 py-4">{asset.category}</td>
                      <td className="px-6 py-4">{asset.department}</td>
                      <td className="px-6 py-4">
                        {asset.currentHolder ? (
                          <div className="flex flex-col">
                            <span className="text-slate-300 font-medium text-xs">{asset.currentHolder}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{asset.location || '—'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/assets/${asset.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-150"
                            title="View Specifications"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </Link>
                          <Link
                            to={`/assets/edit/${asset.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-all duration-150"
                            title="Edit Asset"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(asset.id, asset.assetTag)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-800 transition-all duration-150"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="md:hidden divide-y divide-slate-800/80">
              {assets.map((asset) => (
                <div key={asset.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {asset.image ? (
                      <img
                        src={asset.image}
                        alt={asset.assetName}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center font-bold text-sm text-slate-500 uppercase flex-shrink-0">
                        {asset.assetName.substring(0, 2)}
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="text-slate-100 font-semibold text-sm leading-tight">{asset.assetName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-slate-400">{asset.assetTag}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-500">S/N: {asset.serialNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs py-2 border-t border-b border-slate-800/40">
                    <div>
                      <span className="text-slate-500">Category:</span> <span className="text-slate-300">{asset.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Dept:</span> <span className="text-slate-300">{asset.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Holder:</span> <span className="text-slate-300">{asset.currentHolder || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span> <span className="text-slate-300">{asset.location || '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <StatusBadge status={asset.status} />
                    <div className="flex gap-2">
                      <Link
                        to={`/assets/${asset.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                      <Link
                        to={`/assets/edit/${asset.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-xs font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-slate-800/80 bg-slate-900/20">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
