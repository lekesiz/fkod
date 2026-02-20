/**
 * F-KOD Plugin Framework
 * Main entry point for plugin system
 */

const PluginLoader = require('./PluginLoader');
const PluginHooks = require('./PluginHooks');
const PluginSecurity = require('./PluginSecurity');

class PluginFramework {
  constructor(options = {}) {
    this.loader = new PluginLoader(options);
    this.hooks = new PluginHooks();
    this.security = new PluginSecurity();
    this.options = options;
  }

  /**
   * Initialize plugin framework
   */
  async initialize() {
    await this.loader.loadAllPlugins();
    return this;
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id) {
    return this.loader.getPlugin(id);
  }

  /**
   * Get all plugins
   */
  getAllPlugins() {
    return this.loader.getAllPlugins();
  }

  /**
   * Load a plugin
   */
  async loadPlugin(pluginPath) {
    return await this.loader.loadPlugin(pluginPath);
  }

  /**
   * Unload a plugin
   */
  unloadPlugin(pluginId) {
    this.loader.unloadPlugin(pluginId);
  }

  /**
   * Execute hooks
   */
  async executeHooks(event, data) {
    return await this.loader.executeHooks(event, data);
  }

  /**
   * Register hook
   */
  registerHook(pluginId, event, handler) {
    this.loader.registerHook(pluginId, event, handler);
  }

  /**
   * Add action
   */
  addAction(hook, callback, priority) {
    this.hooks.addAction(hook, callback, priority);
  }

  /**
   * Do action
   */
  async doAction(hook, ...args) {
    return await this.hooks.doAction(hook, ...args);
  }

  /**
   * Add filter
   */
  addFilter(hook, callback, priority) {
    this.hooks.addFilter(hook, callback, priority);
  }

  /**
   * Apply filters
   */
  async applyFilters(hook, value, ...args) {
    return await this.hooks.applyFilters(hook, value, ...args);
  }

  /**
   * Grant permissions
   */
  grantPermissions(pluginId, permissions) {
    this.security.grantPermissions(pluginId, permissions);
  }

  /**
   * Check permission
   */
  hasPermission(pluginId, permission) {
    return this.security.hasPermission(pluginId, permission);
  }

  /**
   * Get routes
   */
  getRoutes() {
    return this.loader.getRoutes();
  }
}

module.exports = PluginFramework;
