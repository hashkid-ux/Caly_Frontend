import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * useSectorConfig - Custom hook for sector configuration management
 * Handles fetching and saving sector-specific API credentials
 */
export const useSectorConfig = (token) => {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSectorConfig = useCallback(async (sector) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/sector-config/${sector}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setConfigs({
        ...configs,
        [sector]: response.data.data
      });

      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch sector config';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, configs]);

  const saveSectorConfig = useCallback(async (sector, config) => {
    try {
      const response = await axios.post(
        '/api/sector-config',
        {
          sector,
          config
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConfigs({
        ...configs,
        [sector]: response.data.data
      });

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, [token, configs]);

  const getAllSectors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sector-config', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    configs,
    loading,
    error,
    fetchSectorConfig,
    saveSectorConfig,
    getAllSectors
  };
};

export default useSectorConfig;
