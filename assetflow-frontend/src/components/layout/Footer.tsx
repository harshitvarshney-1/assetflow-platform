import React from 'react';

/**
 * 1. File Name: Footer.tsx
 * 2. Folder Location: assetflow-frontend/src/components/layout/
 * 3. Purpose: Application footer.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 mt-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} AssetFlow Enterprise. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Support</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
