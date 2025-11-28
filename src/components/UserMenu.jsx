import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { LanguageSwitcher, ThemeSwitcher } from './index';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const initials = getInitials(user?.name || user?.email);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500 truncate">{user?.companyName || 'Setup Pending'}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50 transition-colors`}>
          <div className={`p-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{user?.name || user?.email}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
          </div>

          <div className={`py-1 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-4 py-2">
              <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Theme</p>
              <ThemeSwitcher compact={true} />
            </div>
            <div className="px-4 py-2">
              <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Language</p>
              <LanguageSwitcher compact={true} />
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={handleSettings}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span>{t('common.settings')}</span>
            </button>
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
            >
              <User className="w-4 h-4" />
              <span>{t('common.profile')}</span>
            </button>
          </div>

          <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-1`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} transition-colors`}
            >
              <LogOut className="w-4 h-4" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
