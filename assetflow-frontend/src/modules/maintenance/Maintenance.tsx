import React from 'react';
import { Wrench, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const mockRequests = [
  { id: 'M-521', asset: 'Projector Epson', issue: 'Lamp replacement', priority: 'High', status: 'In Progress', submittedBy: 'HR Dept' },
  { id: 'M-522', asset: 'Office Chair', issue: 'Broken wheel', priority: 'Low', status: 'Pending Approval', submittedBy: 'John Doe' },
];

const Maintenance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and approve asset repair workflows.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Wrench size={18} />
          <span>Raise Request</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">{req.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{req.asset}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{req.issue}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${req.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{req.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-3">
                    <button className="text-green-600 hover:text-green-900" title="Approve"><CheckCircle size={18}/></button>
                    <button className="text-red-600 hover:text-red-900" title="Reject"><AlertCircle size={18}/></button>
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

export default Maintenance;
