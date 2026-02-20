/**
 * Hook to get and update plugin settings
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

export const usePluginSettings = (pluginId) => {
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['plugin-settings', pluginId],
    queryFn: async () => {
      const response = await fetch(`/api/plugins/${pluginId}/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newSettings) => {
      const response = await fetch(`/api/plugins/${pluginId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    }
  });

  const updateSettings = useCallback((newSettings) => {
    return updateMutation.mutateAsync(newSettings);
  }, [updateMutation]);

  return {
    settings: settings || {},
    isLoading,
    error,
    updateSettings,
    isUpdating: updateMutation.isPending
  };
};

export default usePluginSettings;
