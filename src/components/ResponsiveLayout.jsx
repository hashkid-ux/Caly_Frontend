import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import { Menu, X } from 'lucide-react';

const ResponsiveLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Logout logic handled by pages
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-gray-900">Caly</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <nav className="px-4 py-2 space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                Dashboard
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                Call History
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                Analytics
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                Team
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm font-medium text-red-600">
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className={`flex-1 md:ml-0 transition-all duration-300 md:pt-0 pt-16 pb-16 md:pb-0`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation onMenuOpen={mobileMenuOpen} />
    </div>
  );
};

export default ResponsiveLayout;
