import React from 'react';

/**
 * 1. File Name: ReportTable.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/report/components/
 * 3. Purpose: Dynamic table to display report data.
 */
interface ReportTableProps {
  activeReport: string;
}

const mockData = [
  { id: 'AF-0114', name: 'MacBook Pro 16"', category: 'Electronics', department: 'Engineering', status: 'Allocated' },
  { id: 'AF-0092', name: 'Projector Epson', category: 'Equipment', department: 'Facilities', status: 'Under Maintenance' },
  { id: 'AF-0205', name: 'Dell XPS 15', category: 'Electronics', department: 'Sales', status: 'Available' },
  { id: 'AF-0210', name: 'Office Chair Herman Miller', category: 'Furniture', department: 'HR', status: 'Allocated' },
  { id: 'AF-0150', name: 'iPad Pro', category: 'Electronics', department: 'Marketing', status: 'Lost' },
];

const ReportTable: React.FC<ReportTableProps> = ({ activeReport }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset Tag</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.department}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${item.status === 'Available' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-400' : ''}
                  ${item.status === 'Allocated' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' : ''}
                  ${item.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400' : ''}
                  ${item.status === 'Lost' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400' : ''}
                `}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination stub */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">Showing 1 to 5 of 142 results</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-400">1</button>
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
