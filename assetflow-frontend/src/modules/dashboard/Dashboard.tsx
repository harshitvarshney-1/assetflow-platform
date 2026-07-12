import React from 'react';
import StatCard from '../../components/common/StatCard';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Archive,
  Users,
  Building2,
  CalendarDays
} from 'lucide-react';
import AssetUtilizationChart from './components/AssetUtilizationChart';
import DepartmentAssetsChart from './components/DepartmentAssetsChart';
import RecentActivityTable from './components/RecentActivityTable';

/**
 * 1. File Name: Dashboard.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/dashboard/
 * 3. Purpose: Main dashboard view showing statistics, charts, and quick actions.
 */
const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your assets today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            + Register Asset
          </button>
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Assets" value="1,248" icon={Package} trend="+12%" trendUp={true} color="blue" />
        <StatCard title="Allocated" value="843" icon={CheckCircle} trend="+5%" trendUp={true} color="green" />
        <StatCard title="Under Maintenance" value="38" icon={AlertTriangle} trend="-2%" trendUp={false} color="orange" />
        <StatCard title="Active Bookings" value="124" icon={CalendarDays} trend="+18%" trendUp={true} color="purple" />
        <StatCard title="Available Assets" value="342" icon={Archive} trend="+1%" trendUp={true} color="teal" />
        <StatCard title="Total Employees" value="512" icon={Users} color="indigo" />
        <StatCard title="Departments" value="24" icon={Building2} color="slate" />
        <StatCard title="Pending Audits" value="3" icon={Clock} trend="Action Required" color="red" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asset Utilization Trend</h2>
          <AssetUtilizationChart />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assets by Department</h2>
          <DepartmentAssetsChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity Alerts</h2>
          <a href="/logs" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">View All</a>
        </div>
        <RecentActivityTable />
      </div>
    </div>
  );
};

export default Dashboard;
