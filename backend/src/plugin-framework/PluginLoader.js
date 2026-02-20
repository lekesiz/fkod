/**
 * F-KOD Plugin Loader
 * Manages plugin loading, validation, and lifecycle
 */

const fs = require('fs').promises;
const path = require('path');
const semver = require('semver');

class PluginLoader {
  constructor(options = {}) {
    this.pluginsDir = options.pluginsDir || path.join(__dirname, '../../plugins');
    this.plugins = new Map();
    this.hooks = new Map();
    this.components = new Map();
    this.routes = new Map();
    this.logger = options.logger || console;
  }

  /**
   * Load all plugins from directory
   */
  async loadAllPlugins() {
    try {
      const files = await fs.readdir(this.pluginsDir);
      
      for (const file of files) {
        if (file.endsWith('.plugin.js')) {
          await this.loadPlugin(file);
        }
      }

      this.logger.info(`Loaded ${this.plugins.size} plugins`);
      return Array.from(this.plugins.values());
    } catch (error) {
      this.logger.error('Error loading plugins:', error);
      throw error;
    }
  }

  /**
   * Load a single plugin
   */
  async loadPlugin(pluginPath) {
    try {
      const fullPath = path.join(this.pluginsDir, pluginPath);
      const pluginModule = require(fullPath);
      const plugin = pluginModule.default || pluginModule;

      // Validate plugin
      this.validatePlugin(plugin);

      // Store plugin
      this.plugins.set(plugin.id, plugin);

      // Initialize plugin hooks
      if (plugin.hooks) {
        for (const [event, handler] of Object.entries(plugin.hooks)) {
          this.registerHook(plugin.id, event, handler);
        }
      }

      // Initialize plugin components
      if (plugin.components) {
        for (const [name, component] of Object.entries(plugin.components)) {
          this.registerComponent(plugin.id, name, component);
        }
      }

      // Initialize plugin routes
      if (plugin.routes) {
        for (const route of plugin.routes) {
          this.registerRoute(plugin.id, route);
        }
      }

      this.logger.info(`Plugin loaded: ${plugin.id} v${plugin.version}`);
      return plugin;
    } catch (error) {
      this.logger.error(`Error loading plugin ${pluginPath}:`, error);
      throw error;
    }
  }

  /**
   * Validate plugin structure
   */
  validatePlugin(plugin) {
    if (!plugin.id) throw new Error('Plugin must have an id');
    if (!plugin.name) throw new Error('Plugin must have a name');
    if (!plugin.version) throw new Error('Plugin must have a version');

    // Check for duplicate plugins
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} already loaded`);
    }

    // Validate version format
    if (!semver.valid(plugin.version)) {
      throw new Error(`Invalid version format: ${plugin.version}`);
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const [depId, depVersion] of Object.entries(plugin.dependencies)) {
        const dep = this.plugins.get(depId);
        if (!dep) {
          throw new Error(`Dependency not found: ${depId}`);
        }
        if (!semver.satisfies(dep.version, depVersion)) {
          throw new Error(`Dependency version mismatch: ${depId} ${dep.version} does not satisfy ${depVersion}`);
        }
      }
    }
  }

  /**
   * Register a hook
   */
  registerHook(pluginId, event, handler) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push({ pluginId, handler });
  }

  /**
   * Execute hooks for an event
   */
  async executeHooks(event, data) {
    const handlers = this.hooks.get(event) || [];
    const results = [];

    for (const { pluginId, handler } of handlers) {
      try {
        const result = await handler(data);
        results.push({ pluginId, result });
      } catch (error) {
        this.logger.error(`Error executing hook ${event} in plugin ${pluginId}:`, error);
      }
    }

    return results;
  }

  /**
   * Register a component
   */
  registerComponent(pluginId, name, component) {
    const componentId = `${pluginId}:${name}`;
    this.components.set(componentId, { pluginId, name, component });
  }

  /**
   * Get a component
   */
  getComponent(pluginId, name) {
    const componentId = `${pluginId}:${name}`;
    return this.components.get(componentId);
  }

  /**
   * Register a route
   */
  registerRoute(pluginId, route) {
    const routeId = `${pluginId}:${route.method}:${route.path}`;
    this.routes.set(routeId, { pluginId, ...route });
  }

  /**
   * Get all routes
   */
  getRoutes() {
    return Array.from(this.routes.values());
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id) {
    return this.plugins.get(id);
  }

  /**
   * Get all plugins
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Unload a plugin
   */
  unloadPlugin(pluginId) {
    // Remove hooks
    for (const [event, handlers] of this.hooks.entries()) {
      this.hooks.set(event, handlers.filter(h => h.pluginId !== pluginId));
    }

    // Remove components
    for (const [key] of this.components.entries()) {
      if (key.startsWith(`${pluginId}:`)) {
        this.components.delete(key);
      }
    }

    // Remove routes
    for (const [key] of this.routes.entries()) {
      if (key.startsWith(`${pluginId}:`)) {
        this.routes.delete(key);
      }
    }

    // Remove plugin
    this.plugins.delete(pluginId);
    this.logger.info(`Plugin unloaded: ${pluginId}`);
  }
}

module.exports = PluginLoader;
