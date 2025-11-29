import React from 'react';
import { useForm } from 'react-hook-form';

/**
 * AssignAgentModal - Modal for assigning agents to team members
 */
export default function AssignAgentModal({ onClose, onSubmit, agentTypes, memberName }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      agent_type: agentTypes[0] || '',
      proficiency_level: 80,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Assign Agent</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="px-6 pt-6">
          <p className="text-sm text-slate-400 mb-4">
            Assigning agent to: <span className="font-semibold text-white">{memberName}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Agent Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Agent Type *
            </label>
            <select
              {...register('agent_type', { required: 'Agent type is required' })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="">Select an agent...</option>
              {agentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
            {errors.agent_type && (
              <p className="text-red-400 text-sm mt-1">{errors.agent_type.message}</p>
            )}
          </div>

          {/* Proficiency Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Proficiency Level: <span className="text-blue-400" id="proficiency-value">80</span>%
            </label>
            <input
              type="range"
              {...register('proficiency_level')}
              min="0"
              max="100"
              step="5"
              onChange={(e) => {
                register('proficiency_level').onChange(e);
                const display = document.getElementById('proficiency-value');
                if (display) display.textContent = e.target.value;
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-slate-400 mt-2">
              How skilled is this member with this agent type? (0-100%)
            </p>
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
              {isSubmitting ? 'Assigning...' : 'Assign Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
