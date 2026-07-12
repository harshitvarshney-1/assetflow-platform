import React, { useState } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, CalendarClock, MessageSquare } from 'lucide-react';

/**
 * 1. File Name: NotificationDrawer.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/notification/components/
 * 3. Purpose: Drawer for viewing and managing quick notifications.
 */
interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  { id: 1, type: 'alert', title: 'Overdue Return', message: 'MacBook Pro (AF-0114) is overdue for return by 2 days.', time: '10 mins ago', read: false },
  { id: 2, type: 'booking', title: 'Booking Reminder', message: 'Your booking for Meeting Room B2 starts in 15 mins.', time: '1 hour ago', read: false },
  { id: 3, type: 'maintenance', title: 'Maintenance Approved', message: 'Your maintenance request REQ-8902 has been approved.', time: '3 hours ago', read: true },
  { id: 4, type: 'system', title: 'System Update', message: 'AssetFlow will be undergoing scheduled maintenance tonight at 2 AM.', time: '1 day ago', read: true },
];

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            <span className="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">2 New</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center hover:underline focus:outline-none">
            <Check size={16} className="mr-1" /> Mark all as read
          </button>
          <button className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center hover:underline focus:outline-none">
            <Trash2 size={16} className="mr-1" /> Clear all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {notifications.map((notif) => (
                <li 
                  key={notif.id} 
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {notif.type === 'alert' && <AlertCircle size={20} className="text-red-500" />}
                      {notif.type === 'booking' && <CalendarClock size={20} className="text-blue-500" />}
                      {notif.type === 'maintenance' && <Check size={20} className="text-green-500" />}
                      {notif.type === 'system' && <MessageSquare size={20} className="text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-semibold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <div className="mt-2 flex space-x-2">
                          <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer focus:outline-none">
                            View details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 space-y-3">
              <Bell size={48} className="text-gray-300 dark:text-gray-600" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <a href="/notifications" className="block w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
            View all notifications
          </a>
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
