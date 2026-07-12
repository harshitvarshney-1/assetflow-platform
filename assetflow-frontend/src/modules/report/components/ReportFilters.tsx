import React from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * 1. File Name: ReportFilters.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/report/components/
 * 3. Purpose: Dynamic filter panel for reports.
 */
interface ReportFiltersProps {
  activeReport: string;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ activeReport }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center space-x-2 mb-4 text-gray-800 dark:text-gray-200">
        <Filter size={18} />
        <h3 className="font-semibold">Filter Criteria</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
          <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="hr">HR</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
          <input 
            type="date"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex items-end">
          <button className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex justify-center items-center gap-2">
            <Search size={16} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
