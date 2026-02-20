/**
 * Hook to get and update plugin data
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

export const usePluginData = (pluginId, dataKey) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plugin-data', pluginId, dataKey],
    queryFn: async () => {
      const response = await fetch(`/api/plugins/${pluginId}/data/${dataKey}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newData) => {
      const response = await fetch(`/api/plugins/${pluginId}/data/${dataKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!response.ok) throw new Error('Failed to update data');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    }
  });

  const updateData = useCallback((newData) => {
    return updateMutation.mutateAsync(newData);
  }, [updateMutation]);

  return {
    data: data || null,
    isLoading,
    error,
    updateData,
    isUpdating: updateMutation.isPending,
    refetch
  };
};

export default usePluginData;
