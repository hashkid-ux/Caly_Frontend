import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * useQA - Custom hook for QA workflow operations
 * Encapsulates all QA-related API calls with error handling and loading states
 */
const useQA = (token) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch calls to review
  const fetchCallsToReview = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.team_member_id) params.append('team_member_id', filters.team_member_id);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const response = await axios.get(`/api/qa/calls-to-review?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch calls';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch single call for review
  const fetchCallReview = useCallback(
    async (callId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/qa/calls/${callId}/review`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch call details';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Submit QA review
  const submitReview = useCallback(
    async (callId, reviewData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `/api/qa/calls/${callId}/review`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to submit review';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Get team member QA metrics
  const fetchTeamMemberMetrics = useCallback(
    async (memberId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/qa/team-member/${memberId}/qa-metrics`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch metrics';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Get coaching assignments
  const fetchCoachingAssignments = useCallback(
    async (memberId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/qa/team-member/${memberId}/coaching`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch coaching data';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Create coaching assignment
  const createCoachingAssignment = useCallback(
    async (memberId, assignmentData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `/api/qa/team-member/${memberId}/coaching`,
          assignmentData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to create coaching assignment';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Add coaching progress
  const addCoachingProgress = useCallback(
    async (assignmentId, progressData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `/api/qa/coaching/${assignmentId}/progress`,
          progressData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        return response.data.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to add progress';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    loading,
    error,
    clearError: () => setError(null),
    fetchCallsToReview,
    fetchCallReview,
    submitReview,
    fetchTeamMemberMetrics,
    fetchCoachingAssignments,
    createCoachingAssignment,
    addCoachingProgress
  };
};

export default useQA;
