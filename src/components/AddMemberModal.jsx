import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * AddMemberModal - Modal for adding team members
 */
export default function AddMemberModal({ onClose, onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      user_id: '',
      title: '',
      role: 'member',
    },
  });

  const ROLES = [
    { value: 'member', label: 'Team Member' },
    { value: 'lead', label: 'Team Lead' },
    { value: 'manager', label: 'Manager' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Add Team Member</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              User ID (UUID) *
            </label>
            <input
              type="text"
              {...register('user_id', {
                required: 'User ID is required',
              })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="00000000-0000-0000-0000-000000000000"
            />
            {errors.user_id && (
              <p className="text-red-400 text-sm mt-1">{errors.user_id.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="e.g., Support Specialist"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Role *
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
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
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
