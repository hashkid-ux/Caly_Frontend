/**
 * Enhanced Sidebar Navigation
 * Complete menu with all pages: Settings, Agents, Providers, etc.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, BarChart3, Phone, TrendingUp, Users, Settings,
  LogOut, Zap, Share2, Shield, User, Home
} from 'lucide-react';
import './SidebarComplete.css';

const SidebarComplete = ({ isOpen, onToggle, onLogout, userRole = 'user' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Main navigation items
  const mainItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'user'] },
    { icon: Phone, label: 'Call History', path: '/call-history', roles: ['admin', 'user'] },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics', roles: ['admin', 'user'] },
    { icon: Users, label: 'Team', path: '/team', roles: ['admin'] },
  ];

  // Configuration items (collapsible)
  const configItems = [
    { icon: Settings, label: 'API Credentials', path: '/settings', roles: ['admin'] },
    { icon: Zap, label: 'Agents', path: '/agents', roles: ['admin'] },
    { icon: Share2, label: 'Providers', path: '/providers', roles: ['admin'] },
  ];

  // Bottom items
  const bottomItems = [
    { icon: Shield, label: 'Security', path: '/security', roles: ['admin'] },
    { icon: User, label: 'Profile', path: '/profile', roles: ['admin', 'user'] },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Filter items by role
  const filterByRole = (items) => {
    return items.filter(item => item.roles.includes(userRole));
  };

  return (
    <div className={`sidebar-complete ${isOpen ? 'open' : 'closed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          {isOpen && <h1 className="logo-text">Caly</h1>}
          <span className="logo-icon">🎙️</span>
        </div>
        <button
          onClick={onToggle}
          className="toggle-btn"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {isOpen && <div className="nav-section-title">Main</div>}
          <div className="nav-items">
            {filterByRole(mainItems).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${active ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon size={20} className="nav-icon" />
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Section */}
        {filterByRole(configItems).length > 0 && (
          <div className="nav-section">
            {isOpen && <div className="nav-section-title">Configuration</div>}
            <div className="nav-items">
              {filterByRole(configItems).map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`nav-item ${active ? 'active' : ''}`}
                    title={item.label}
                  >
                    <Icon size={20} className="nav-icon" />
                    {isOpen && <span className="nav-label">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        {filterByRole(bottomItems).length > 0 && (
          <div className="nav-items">
            {filterByRole(bottomItems).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${active ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon size={20} className="nav-icon" />
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="logout-btn"
          title="Logout"
        >
          <LogOut size={20} className="nav-icon" />
          {isOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>

      {/* Collapse Hint */}
      {isOpen && (
        <div className="sidebar-hint">
          💡 Click the menu icon to collapse
        </div>
      )}
    </div>
  );
};

export default SidebarComplete;
