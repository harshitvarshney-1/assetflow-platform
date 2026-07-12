import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Save, FileText, Image as ImageIcon, Check } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

const assetFormSchema = z.object({
  assetName: z.string().min(1, 'Asset name is required').max(255, 'Max 255 characters'),
  category: z.string().min(1, 'Category is required'),
  department: z.string().min(1, 'Department is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  purchaseCost: z.coerce.number().min(0, 'Purchase cost must be greater than or equal to 0'),
  manufacturer: z.string().optional().or(z.literal('')),
  modelNumber: z.string().optional().or(z.literal('')),
  warrantyExpiry: z.string().optional().nullable().or(z.literal('')),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']),
  location: z.string().optional().or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
  documents: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(['AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED']),
}).refine((data) => {
  if (data.warrantyExpiry && data.purchaseDate) {
    return new Date(data.warrantyExpiry) >= new Date(data.purchaseDate);
  }
  return true;
}, {
  message: 'Warranty date must be after or equal to purchase date',
  path: ['warrantyExpiry'],
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

export const AssetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      condition: 'NEW',
      status: 'AVAILABLE',
      purchaseCost: 0,
      image: '',
      documents: '',
    },
  });

  useEffect(() => {
    const fetchAsset = async () => {
      if (!isEdit) return;
      try {
        const response = await api.get(`/assets/${id}`);
        if (response.data.success) {
          const a = response.data.data;
          // Prepopulate form values, converting dates to strings for input tags
          reset({
            assetName: a.assetName,
            category: a.category,
            department: a.department,
            serialNumber: a.serialNumber,
            purchaseDate: a.purchaseDate,
            purchaseCost: a.purchaseCost,
            manufacturer: a.manufacturer || '',
            modelNumber: a.modelNumber || '',
            warrantyExpiry: a.warrantyExpiry || '',
            condition: a.condition,
            location: a.location || '',
            image: a.image || '',
            documents: a.documents || '',
            description: a.description || '',
            status: a.status,
          });
          if (a.image) setImageUploaded(true);
          if (a.documents) setDocUploaded(true);
        }
      } catch (error: any) {
        showToast('Failed to load asset details', 'error');
        navigate('/assets');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAsset();
  }, [id, isEdit, reset, navigate, showToast]);

  const onSubmit = async (values: AssetFormValues) => {
    setLoading(true);
    try {
      // Empty optional strings clean up for DB representation
      const payload = {
        ...values,
        warrantyExpiry: values.warrantyExpiry ? values.warrantyExpiry : null,
      };

      if (isEdit) {
        const response = await api.put(`/assets/${id}`, payload);
        if (response.data.success) {
          showToast('Asset updated successfully', 'success');
          navigate(`/assets/${id}`);
        }
      } else {
        const response = await api.post('/assets', payload);
        if (response.data.success) {
          showToast('Asset registered successfully', 'success');
          navigate('/assets');
        }
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      showToast(error.response?.data?.message || 'Action failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mock Upload Handlers
  const handleImageMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Seed a high quality mock unsplash image for visual layout check
      const urls = [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'
      ];
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      setValue('image', randomUrl);
      setImageUploaded(true);
      showToast('Image uploaded successfully (Mock Mode)', 'success');
    }
  };

  const handleDocMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const mockDoc = 'https://www.apple.com/macbook-pro/specs/';
      setValue('documents', mockDoc);
      setDocUploaded(true);
      showToast('Technical document manual link generated (Mock Mode)', 'success');
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

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Upper Title Grid */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/assets" className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{isEdit ? 'Edit Asset Specs' : 'Register New Asset'}</h1>
            <p className="text-slate-400 text-xs mt-0.5">Please fill out all operational constraints for the device.</p>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-8">
        
        {/* SECTION 1: Base Specs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Device Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset Name *</label>
              <input
                type="text"
                placeholder="MacBook Pro 16..."
                {...register('assetName')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
              {errors.assetName && (
                <p className="text-rose-500 text-xs mt-1">{errors.assetName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
              <select
                {...register('category')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              >
                <option value="">Select Category</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Monitors">Monitors</option>
                <option value="Servers">Servers</option>
                <option value="Printers">Printers</option>
                <option value="Furniture">Furniture</option>
              </select>
              {errors.category && (
                <p className="text-rose-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department *</label>
              <select
                {...register('department')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
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
              {errors.department && (
                <p className="text-rose-500 text-xs mt-1">{errors.department.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Identifiers */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Serial Keys & Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Serial Number *</label>
              <input
                type="text"
                placeholder="C02F234X..."
                {...register('serialNumber')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
              {errors.serialNumber && (
                <p className="text-rose-500 text-xs mt-1">{errors.serialNumber.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Condition *</label>
              <select
                {...register('condition')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              >
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
                <option value="DAMAGED">Damaged</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status *</label>
              <select
                {...register('status')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
                disabled={isEdit && watch('status') === 'ALLOCATED'}
              >
                <option value="AVAILABLE">Available</option>
                <option value="ALLOCATED" disabled>Allocated (Must use Checkout flow)</option>
                <option value="RESERVED">Reserved</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="LOST">Lost</option>
                <option value="RETIRED">Retired</option>
                <option value="DISPOSED">Disposed</option>
              </select>
              {isEdit && watch('status') === 'ALLOCATED' && (
                <span className="text-[10px] text-amber-500 mt-1 block">Active assignments must be returned to change status.</span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Cost and Dates */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Procurement & Warranties</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Purchase Date *</label>
              <input
                type="date"
                {...register('purchaseDate')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
              {errors.purchaseDate && (
                <p className="text-rose-500 text-xs mt-1">{errors.purchaseDate.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Purchase Cost ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="2499.00"
                {...register('purchaseCost')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
              {errors.purchaseCost && (
                <p className="text-rose-500 text-xs mt-1">{errors.purchaseCost.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Warranty Expiry</label>
              <input
                type="date"
                {...register('warrantyExpiry')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
              {errors.warrantyExpiry && (
                <p className="text-rose-500 text-xs mt-1">{errors.warrantyExpiry.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Logistics */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Logistics & Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Manufacturer</label>
              <input
                type="text"
                placeholder="Apple / Dell..."
                {...register('manufacturer')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Model Number</label>
              <input
                type="text"
                placeholder="A2991 / XPS-15..."
                {...register('modelNumber')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Storage Location</label>
              <input
                type="text"
                placeholder="HQ - Storage Cabinet A..."
                {...register('location')}
                className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              placeholder="Provide technical descriptions or special asset logs here..."
              rows={4}
              {...register('description')}
              className="w-full text-sm rounded-xl glass-input p-3 text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 5: Upload Files */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Media & Attachments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Image mock upload */}
            <div className="p-5 border border-slate-800 border-dashed bg-slate-950/20 rounded-2xl flex flex-col items-center justify-center text-center">
              {imageUploaded ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold block">Device Image Linked</span>
                  {watch('image') && (
                    <img src={watch('image')} alt="Device preview" className="w-20 h-20 object-cover rounded-lg border border-slate-800 mt-2 mx-auto" />
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 inline-block">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Device Image Upload</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Select file to link a mock high-quality photo</span>
                  </div>
                </div>
              )}
              <label className="mt-4 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors">
                <span>Choose Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageMockUpload} />
              </label>
            </div>

            {/* Document mock upload */}
            <div className="p-5 border border-slate-800 border-dashed bg-slate-950/20 rounded-2xl flex flex-col items-center justify-center text-center">
              {docUploaded ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold block">Specification Manual Linked</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-xs block">{watch('documents')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 inline-block">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Specification Manual / Document</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Upload specifications, receipt logs, or guidelines</span>
                  </div>
                </div>
              )}
              <label className="mt-4 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors">
                <span>Choose File</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleDocMockUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800/40 pt-6">
          <Link
            to={isEdit ? `/assets/${id}` : '/assets'}
            className="px-5 py-2.5 text-sm font-semibold text-slate-400 bg-slate-950 border border-slate-800/80 rounded-xl hover:bg-slate-900 hover:text-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Asset'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
