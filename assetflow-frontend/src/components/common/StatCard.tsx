import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * 1. File Name: StatCard.tsx
 * 2. Folder Location: assetflow-frontend/src/components/common/
 * 3. Purpose: Reusable statistics card for dashboard KPIs.
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'teal' | 'indigo' | 'slate';
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp, color = 'blue' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trendUp !== undefined ? (
            trendUp ? (
              <TrendingUp size={16} className="text-green-500 mr-1" />
            ) : (
              <TrendingDown size={16} className="text-red-500 mr-1" />
            )
          ) : null}
          <span className={`font-medium ${
            trendUp === true ? 'text-green-500' : trendUp === false ? 'text-red-500' : 'text-orange-500'
          }`}>
            {trend}
          </span>
          <span className="text-gray-400 ml-2 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
