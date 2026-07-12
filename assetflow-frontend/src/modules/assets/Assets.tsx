import React, { useState } from 'react';
import { Plus, Search, Filter, Box } from 'lucide-react';

const mockAssets = [
  { id: 'AF-0114', name: 'MacBook Pro 16"', category: 'Electronics', status: 'Allocated', assignee: 'Priya Sharma' },
  { id: 'AF-0092', name: 'Projector Epson', category: 'Equipment', status: 'Under Maintenance', assignee: '-' },
  { id: 'AF-0205', name: 'Dell XPS 15', category: 'Electronics', status: 'Available', assignee: '-' },
];

const Assets: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assets Directory</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track all organizational assets.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          <span>Register Asset</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search by name, tag, or serial..." className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset Tag</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">{asset.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{asset.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{asset.category}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400">
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{asset.assignee}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;
