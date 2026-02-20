/**
 * Hook to show notifications
 */

import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useNotification = () => {
  const { toast } = useToast();

  const notify = useCallback((message, type = 'default', duration = 3000) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'default',
      info: 'default'
    };

    toast({
      title: message,
      variant: variants[type] || 'default',
      duration
    });
  }, [toast]);

  return { notify };
};

export default useNotification;
