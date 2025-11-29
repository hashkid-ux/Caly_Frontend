import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * CreateTeamModal - Modal for creating a new team
 */
export default function CreateTeamModal({ onClose, onSubmit, sectors }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      sector: sectors[0]?.value || 'healthcare',
      description: '',
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Create New Team</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Team name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Sales Team"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sector *
            </label>
            <select
              {...register('sector', { required: 'Sector is required' })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              {sectors.map((sector) => (
                <option key={sector.value} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>
            {errors.sector && (
              <p className="text-red-400 text-sm mt-1">{errors.sector.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description', { maxLength: 200 })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              placeholder="Team description..."
              rows="3"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
