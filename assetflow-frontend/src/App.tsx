import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ERPLayout from './layouts/ERPLayout';
import Dashboard from './modules/dashboard/Dashboard';
import Reports from './modules/report/Reports';
import ActivityLogs from './modules/shared/ActivityLogs';
import Assets from './modules/assets/Assets';
import Bookings from './modules/bookings/Bookings';
import Maintenance from './modules/maintenance/Maintenance';
import Audits from './modules/audits/Audits';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ERPLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="logs" element={<ActivityLogs />} />
          
          <Route path="assets" element={<Assets />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="audits" element={<Audits />} />
          
          {/* 404 Route */}
          <Route path="*" element={<div className="p-6 text-center text-red-500 font-bold text-2xl">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
