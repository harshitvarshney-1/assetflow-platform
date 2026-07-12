import React from 'react';

/**
 * 1. File Name: RecentActivityTable.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/dashboard/components/
 * 3. Purpose: Table component to display recent activity from across modules on the dashboard.
 */

const activities = [
  {
    id: 1,
    action: 'Asset Assigned',
    asset: 'MacBook Pro (AF-0114)',
    user: 'Priya Sharma',
    time: '2 hours ago',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
  },
  {
    id: 2,
    action: 'Maintenance Requested',
    asset: 'Conference Room Projector (AF-0092)',
    user: 'Raj Patel',
    time: '4 hours ago',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
  },
  {
    id: 3,
    action: 'Resource Booked',
    asset: 'Meeting Room B2',
    user: 'Sarah Jenkins',
    time: '5 hours ago',
    status: 'Upcoming',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
  },
  {
    id: 4,
    action: 'Asset Registration',
    asset: 'Dell XPS 15 (AF-0205)',
    user: 'Admin',
    time: '1 day ago',
    status: 'Available',
    statusColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-400'
  },
  {
    id: 5,
    action: 'Overdue Return',
    asset: 'iPad Pro (AF-0150)',
    user: 'John Doe',
    time: '2 days ago',
    status: 'Overdue',
    statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
  }
];

const RecentActivityTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset / Resource</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{activity.asset}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2 text-xs font-bold">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">{activity.user}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.statusColor}`}>
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
