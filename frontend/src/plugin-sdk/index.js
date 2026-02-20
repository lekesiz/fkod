/**
 * F-KOD Plugin SDK
 * Main entry point for plugin SDK
 */

export { PluginProvider, usePlugin } from './PluginContext';
export { usePluginSettings } from './usePluginSettings';
export { usePluginData } from './usePluginData';
export { useNotification } from './useNotification';
export { useModal } from './useModal';
export { useAuth } from './useAuth';

export default {
  PluginProvider: require('./PluginContext').PluginProvider,
  usePlugin: require('./PluginContext').usePlugin,
  usePluginSettings: require('./usePluginSettings').usePluginSettings,
  usePluginData: require('./usePluginData').usePluginData,
  useNotification: require('./useNotification').useNotification,
  useModal: require('./useModal').useModal,
  useAuth: require('./useAuth').useAuth
};
