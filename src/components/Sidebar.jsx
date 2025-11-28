import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, Phone, TrendingUp, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Phone, label: 'Call History', path: '/call-history' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Team', path: '/team' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} hidden md:flex bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 flex-col h-screen fixed left-0 top-0 z-40`}>
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-gray-800 dark:border-gray-800">
        {isOpen && <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Caly</h1>}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-gray-800 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              {isOpen && active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 px-3 py-4 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-all duration-200"
          title={!isOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
