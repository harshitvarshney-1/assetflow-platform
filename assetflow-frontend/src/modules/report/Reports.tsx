import React, { useState } from 'react';
import { FileText, Download, Filter, Printer } from 'lucide-react';
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';
import StatCard from '../../components/common/StatCard';

/**
 * 1. File Name: Reports.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/report/
 * 3. Purpose: Main reporting module view supporting multiple report types and exports.
 */
const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState('assets');

  const reportTypes = [
    { id: 'assets', label: 'Asset Report' },
    { id: 'department', label: 'Department Report' },
    { id: 'allocation', label: 'Allocation Report' },
    { id: 'transfer', label: 'Transfer Report' },
    { id: 'booking', label: 'Booking Report' },
    { id: 'maintenance', label: 'Maintenance Report' },
    { id: 'audit', label: 'Audit Report' },
    { id: 'employee', label: 'Employee Report' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate, view, and export comprehensive system reports.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Printer size={18} />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Report Types */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">Report Categories</h3>
            <ul className="space-y-1">
              {reportTypes.map(type => (
                <li key={type.id}>
                  <button
                    onClick={() => setActiveReport(type.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeReport === type.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FileText size={18} />
                    <span>{type.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content - Filters and Results */}
        <div className="flex-1 space-y-6">
          <ReportFilters activeReport={activeReport} />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {activeReport.replace('-', ' ')} Results
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Records: 142</span>
            </div>
            <ReportTable activeReport={activeReport} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
