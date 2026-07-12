import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileBox, 
  CalendarDays, 
  Wrench, 
  ShieldCheck, 
  Settings, 
  Menu,
  ChevronLeft
} from 'lucide-react';

/**
 * 1. File Name: Sidebar.tsx
 * 2. Folder Location: assetflow-frontend/src/components/layout/
 * 3. Purpose: Responsive sidebar navigation for the ERP layout.
 */
const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assets', path: '/assets', icon: FileBox },
    { label: 'Bookings', path: '/bookings', icon: CalendarDays },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Audits', path: '/audits', icon: ShieldCheck },
    { label: 'Reports', path: '/reports', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && <span className="text-xl font-bold text-blue-600 dark:text-blue-400">AssetFlow</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 Focus:outline-none"
        >
          {collapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className={!collapsed ? 'mr-3' : 'mx-auto'} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
