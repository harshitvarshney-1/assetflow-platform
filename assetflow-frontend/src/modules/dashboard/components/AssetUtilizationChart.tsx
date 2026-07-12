import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * 1. File Name: AssetUtilizationChart.tsx
 * 2. Folder Location: assetflow-frontend/src/modules/dashboard/components/
 * 3. Purpose: Area chart showing asset utilization over time.
 */

const data = [
  { name: 'Jan', utilization: 4000 },
  { name: 'Feb', utilization: 3000 },
  { name: 'Mar', utilization: 2000 },
  { name: 'Apr', utilization: 2780 },
  { name: 'May', utilization: 1890 },
  { name: 'Jun', utilization: 2390 },
  { name: 'Jul', utilization: 3490 },
];

const AssetUtilizationChart: React.FC = () => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
          />
          <Area 
            type="monotone" 
            dataKey="utilization" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorUv)" 
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetUtilizationChart;
