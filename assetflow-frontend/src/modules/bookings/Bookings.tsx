import React from 'react';
import { CalendarDays, Plus, Clock } from 'lucide-react';

const mockBookings = [
  { id: 'B-101', resource: 'Meeting Room A', user: 'John Doe', startTime: '10:00 AM', endTime: '11:00 AM', status: 'Ongoing' },
  { id: 'B-102', resource: 'Company SUV', user: 'Sarah Jenkins', startTime: '02:00 PM', endTime: '05:00 PM', status: 'Upcoming' },
];

const Bookings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resource Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage time-slot bookings for shared resources.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <CalendarDays size={18} />
          <span>New Booking</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
          <input type="date" className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Slot</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockBookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{bk.resource}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{bk.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1"><Clock size={14}/> <span>{bk.startTime} - {bk.endTime}</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${bk.status === 'Ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {bk.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">Cancel</button>
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

export default Bookings;
