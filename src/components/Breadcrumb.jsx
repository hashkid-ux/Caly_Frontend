import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();

  // Map routes to breadcrumb labels
  const breadcrumbMap = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/calls': 'Call History',
    '/call-history': 'Call History',
    '/analytics': 'Analytics',
    '/team': 'Team',
    '/settings': 'Settings',
    '/onboarding': 'Setup',
    '/profile': 'Profile',
  };

  // Generate breadcrumb paths
  const generateBreadcrumbs = () => {
    const pathArray = location.pathname.split('/').filter(Boolean);
    
    // Always start with home
    const breadcrumbs = [
      { label: 'Dashboard', path: '/dashboard' }
    ];

    // Add current path segments
    let currentPath = '';
    pathArray.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = breadcrumbMap[currentPath] || 
                    segment.replace(/-/g, ' ').charAt(0).toUpperCase() + 
                    segment.replace(/-/g, ' ').slice(1);
      
      // Only add if it's not the dashboard (already added)
      if (segment !== 'dashboard') {
        breadcrumbs.push({ label, path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/callback') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400 dark:text-gray-500" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
