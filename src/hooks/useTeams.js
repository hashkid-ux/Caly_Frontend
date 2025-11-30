import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * useTeams - Custom hook for team management API operations
 * Handles fetching, creating, updating, and deleting team members
 */
export const useTeams = (token) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch team members';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addTeamMember = useCallback(async (memberData) => {
    try {
      const response = await axios.post('/api/teams/members', memberData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers([...teamMembers, response.data.data]);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, [token, teamMembers]);

  const updateTeamMember = useCallback(async (memberId, updates) => {
    try {
      const response = await axios.put(
        `/api/teams/members/${memberId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeamMembers(
        teamMembers.map(m => m.id === memberId ? response.data.data : m)
      );
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, [token, teamMembers]);

  const deleteTeamMember = useCallback(async (memberId) => {
    try {
      await axios.delete(`/api/teams/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    } catch (err) {
      throw err;
    }
  }, [token, teamMembers]);

  const assignAgents = useCallback(async (memberId, assignments) => {
    try {
      const response = await axios.put(
        `/api/teams/members/${memberId}/agents`,
        { assignments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeamMembers(
        teamMembers.map(m => m.id === memberId ? response.data.data : m)
      );
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, [token, teamMembers]);

  const getTeamMemberPerformance = useCallback(async (memberId) => {
    try {
      const response = await axios.get(
        `/api/teams/members/${memberId}/performance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, [token]);

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    assignAgents,
    getTeamMemberPerformance
  };
};

export default useTeams;
