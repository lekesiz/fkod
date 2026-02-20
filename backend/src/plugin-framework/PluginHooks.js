/**
 * F-KOD Plugin Hooks System
 * Manages plugin hooks and event system
 */

class PluginHooks {
  constructor() {
    this.hooks = new Map();
    this.filters = new Map();
  }

  /**
   * Register an action hook
   */
  addAction(hook, callback, priority = 10) {
    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, []);
    }

    this.hooks.get(hook).push({ callback, priority });
    this.hooks.get(hook).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Remove an action hook
   */
  removeAction(hook, callback) {
    if (this.hooks.has(hook)) {
      const handlers = this.hooks.get(hook);
      const index = handlers.findIndex(h => h.callback === callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Execute action hooks
   */
  async doAction(hook, ...args) {
    if (!this.hooks.has(hook)) return;

    const handlers = this.hooks.get(hook);
    for (const { callback } of handlers) {
      try {
        await callback(...args);
      } catch (error) {
        console.error(`Error in hook ${hook}:`, error);
      }
    }
  }

  /**
   * Register a filter hook
   */
  addFilter(hook, callback, priority = 10) {
    if (!this.filters.has(hook)) {
      this.filters.set(hook, []);
    }

    this.filters.get(hook).push({ callback, priority });
    this.filters.get(hook).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Remove a filter hook
   */
  removeFilter(hook, callback) {
    if (this.filters.has(hook)) {
      const handlers = this.filters.get(hook);
      const index = handlers.findIndex(h => h.callback === callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Apply filter hooks
   */
  async applyFilters(hook, value, ...args) {
    if (!this.filters.has(hook)) return value;

    let result = value;
    const handlers = this.filters.get(hook);

    for (const { callback } of handlers) {
      try {
        result = await callback(result, ...args);
      } catch (error) {
        console.error(`Error in filter ${hook}:`, error);
      }
    }

    return result;
  }

  /**
   * Get all hooks
   */
  getAllHooks() {
    return {
      actions: Object.fromEntries(this.hooks),
      filters: Object.fromEntries(this.filters)
    };
  }
}

module.exports = PluginHooks;
