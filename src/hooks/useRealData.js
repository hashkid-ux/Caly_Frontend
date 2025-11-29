import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Hook to fetch analytics KPIs (real data from backend)
 */
export function useAnalytics(clientId, options = {}) {
  const { sector = null, days = 7 } = options;
  const { token } = useAuth();

  return useQuery(
    ['analytics', clientId, sector, days],
    async () => {
      const params = new URLSearchParams({
        clientId,
        days,
        ...(sector && { sector })
      });

      const response = await fetch(`${API_URL}/api/analytics/kpis?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      ...options
    }
  );
}

/**
 * Hook to fetch analytics summary (quick dashboard stats)
 */
export function useAnalyticsSummary(clientId) {
  const { token } = useAuth();

  return useQuery(
    ['analytics-summary', clientId],
    async () => {
      const response = await fetch(`${API_URL}/api/analytics/summary?clientId=${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics summary');
      return response.json();
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    }
  );
}

/**
 * Hook to fetch company settings
 */
export function useSettings(clientId) {
  const { token } = useAuth();

  return useQuery(
    ['settings', clientId],
    async () => {
      const response = await fetch(`${API_URL}/api/settings/company/${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000
    }
  );
}

/**
 * Hook to update company settings
 */
export function useUpdateSettings(clientId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (updates) => {
      const response = await fetch(`${API_URL}/api/settings/company/${clientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    {
      onSuccess: () => {
        // Invalidate queries so they refetch
        queryClient.invalidateQueries(['settings', clientId]);
        queryClient.invalidateQueries(['analytics', clientId]);
      }
    }
  );
}

/**
 * Hook to fetch business rules
 */
export function useBusinessRules(clientId) {
  const { token } = useAuth();

  return useQuery(
    ['business-rules', clientId],
    async () => {
      const response = await fetch(`${API_URL}/api/settings/business-rules/${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch business rules');
      return response.json();
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000
    }
  );
}

/**
 * Hook to fetch available sectors
 */
export function useSectors(clientId) {
  const { token } = useAuth();

  return useQuery(
    ['sectors', clientId],
    async () => {
      const response = await fetch(`${API_URL}/api/settings/sectors/${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch sectors');
      return response.json();
    },
    {
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000
    }
  );
}

/**
 * Hook to fetch teams (real data from backend)
 */
export function useTeams(clientId, options = {}) {
  const { sector = null, status = 'active' } = options;
  const { token } = useAuth();

  return useQuery(
    ['teams', clientId, sector, status],
    async () => {
      const params = new URLSearchParams({
        ...(sector && { sector }),
        status
      });

      const response = await fetch(`${API_URL}/api/teams?clientId=${clientId}&${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch teams');
      return response.json();
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    }
  );
}

/**
 * Hook to fetch team details with members and performance
 */
export function useTeamDetails(teamId) {
  const { token } = useAuth();

  return useQuery(
    ['team', teamId],
    async () => {
      const response = await fetch(`${API_URL}/api/teams/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch team details');
      return response.json();
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    }
  );
}

/**
 * Hook to create new team
 */
export function useCreateTeam(clientId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (teamData) => {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId,
          ...teamData
        })
      });

      if (!response.ok) throw new Error('Failed to create team');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['teams', clientId]);
      }
    }
  );
}

/**
 * Hook to fetch call history (real data from backend)
 */
export function useCalls(clientId, options = {}) {
  const { page = 1, limit = 50, filters = {} } = options;
  const { token } = useAuth();

  return useQuery(
    ['calls', clientId, page, limit, filters],
    async () => {
      const params = new URLSearchParams({
        clientId,
        page,
        limit,
        ...filters
      });

      const response = await fetch(`${API_URL}/api/calls?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch calls');
      return response.json();
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000
    }
  );
}

/**
 * Hook to fetch agents available for a sector
 */
export function useSectorAgents(sector) {
  const { token } = useAuth();

  return useQuery(
    ['sector-agents', sector],
    async () => {
      const response = await fetch(`${API_URL}/api/sector/${sector}/agents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
    {
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000
    }
  );
}

/**
 * Hook to fetch sector configuration
 */
export function useSectorConfig(sector, clientId) {
  const { token } = useAuth();

  return useQuery(
    ['sector-config', sector, clientId],
    async () => {
      const response = await fetch(`${API_URL}/api/sector/config/${sector}?clientId=${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch sector config');
      return response.json();
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000
    }
  );
}
