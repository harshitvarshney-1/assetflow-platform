import React from 'react';
import { ShieldCheck, Plus, Check, Play } from 'lucide-react';

const mockAudits = [
  { id: 'AUD-2026-07', name: 'July IT Equipment Audit', scope: 'Engineering', status: 'In Progress', progress: '65%' },
  { id: 'AUD-2026-06', name: 'June Furniture Audit', scope: 'All Departments', status: 'Closed', progress: '100%' },
];

const Audits: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Cycles</h1>
          <p className="text-gray-500 dark:text-gray-400">Run structured verification cycles and catch discrepancies.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          <span>New Audit Cycle</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Audit ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scope</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">{audit.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{audit.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{audit.scope}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: audit.progress }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{audit.progress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${audit.status === 'Closed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-3">
                    {audit.status !== 'Closed' && <button className="text-blue-600 hover:text-blue-900"><Play size={16}/></button>}
                    <button className="text-gray-600 hover:text-gray-900">Report</button>
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

export default Audits;
