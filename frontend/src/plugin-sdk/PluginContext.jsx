/**
 * F-KOD Plugin Context
 * Provides plugin functionality to React components
 */

import React, { createContext, useContext, useCallback } from 'react';

const PluginContext = createContext(null);

export const PluginProvider = ({ children, plugins = {} }) => {
  const getPlugin = useCallback((pluginId) => {
    return plugins[pluginId];
  }, [plugins]);

  const value = {
    plugins,
    getPlugin
  };

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePlugin = (pluginId) => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugin must be used within PluginProvider');
  }
  return context.getPlugin(pluginId);
};

export default PluginContext;
