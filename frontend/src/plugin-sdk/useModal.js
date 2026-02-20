/**
 * Hook to show modals
 */

import { useCallback, useState } from 'react';

export const useModal = () => {
  const [modals, setModals] = useState([]);

  const showModal = useCallback((config) => {
    const id = Date.now();
    const modal = { id, ...config };
    setModals(prev => [...prev, modal]);
    
    return new Promise((resolve) => {
      modal.resolve = resolve;
    });
  }, []);

  const closeModal = useCallback((id, result) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal && modal.resolve) {
        modal.resolve(result);
      }
      return prev.filter(m => m.id !== id);
    });
  }, []);

  return { showModal, closeModal, modals };
};

export default useModal;
