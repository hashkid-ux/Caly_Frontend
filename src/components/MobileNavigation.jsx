import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, Phone, TrendingUp, Users } from 'lucide-react';

const MobileNavigation = memo(({ onMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Phone, label: 'Calls', path: '/call-history' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Team', path: '/team' },
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t z-40 md:hidden`}>
      <div className="flex items-center justify-around h-16 pb-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 transition-all duration-200 rounded-lg ${
                active
                  ? `${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`
                  : `${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

MobileNavigation.displayName = 'MobileNavigation';
export default MobileNavigation;
