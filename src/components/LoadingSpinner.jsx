import React from 'react';

/**
 * LoadingSpinner - Loading indicator component
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <p className="text-slate-400 text-lg">{message}</p>
    </div>
  );
}
