import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle, 
  showBackButton = true, 
  actions = null,
  breadcrumb = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on main pages (dashboard, analytics, team, etc.)
  const mainPages = ['/dashboard', '/analytics', '/team', '/settings'];
  const isMainPage = mainPages.includes(location.pathname);
  const shouldShowBack = showBackButton && !isMainPage;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {breadcrumb}
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {shouldShowBack && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Go back"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {subtitle && <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 truncate">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
