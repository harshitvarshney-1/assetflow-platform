import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * 1. File Name: ERPLayout.tsx
 * 2. Folder Location: assetflow-frontend/src/layouts/
 * 3. Purpose: Main wrapper for the ERP application providing Sidebar, Navbar, and content area.
 */
const ERPLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ERPLayout;
