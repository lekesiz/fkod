/**
 * F-KOD Plugin Security
 * Manages plugin permissions and security
 */

const PERMISSIONS = {
  // User permissions
  'read:users': 'Read user data',
  'write:users': 'Write user data',
  'delete:users': 'Delete user data',

  // Course permissions
  'read:courses': 'Read course data',
  'write:courses': 'Write course data',
  'delete:courses': 'Delete course data',

  // Analytics permissions
  'read:analytics': 'Read analytics data',
  'write:analytics': 'Write analytics data',

  // Community permissions
  'read:community': 'Read community data',
  'write:community': 'Write community data',

  // Admin permissions
  'admin:access': 'Access admin panel',
  'admin:settings': 'Modify admin settings',
  'admin:users': 'Manage users',
  'admin:plugins': 'Manage plugins'
};

class PluginSecurity {
  constructor() {
    this.pluginPermissions = new Map();
    this.userPermissions = new Map();
  }

  /**
   * Grant permissions to a plugin
   */
  grantPermissions(pluginId, permissions) {
    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    // Validate permissions
    for (const perm of permissions) {
      if (!PERMISSIONS[perm]) {
        throw new Error(`Invalid permission: ${perm}`);
      }
    }

    this.pluginPermissions.set(pluginId, permissions);
  }

  /**
   * Check if plugin has permission
   */
  hasPermission(pluginId, permission) {
    const permissions = this.pluginPermissions.get(pluginId) || [];
    return permissions.includes(permission);
  }

  /**
   * Check if plugin has all permissions
   */
  hasAllPermissions(pluginId, permissions) {
    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    return permissions.every(perm => this.hasPermission(pluginId, perm));
  }

  /**
   * Check if plugin has any permission
   */
  hasAnyPermission(pluginId, permissions) {
    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    return permissions.some(perm => this.hasPermission(pluginId, perm));
  }

  /**
   * Get plugin permissions
   */
  getPermissions(pluginId) {
    return this.pluginPermissions.get(pluginId) || [];
  }

  /**
   * Revoke permission from plugin
   */
  revokePermission(pluginId, permission) {
    const permissions = this.pluginPermissions.get(pluginId) || [];
    const index = permissions.indexOf(permission);
    if (index !== -1) {
      permissions.splice(index, 1);
      this.pluginPermissions.set(pluginId, permissions);
    }
  }

  /**
   * Revoke all permissions from plugin
   */
  revokeAllPermissions(pluginId) {
    this.pluginPermissions.delete(pluginId);
  }

  /**
   * Get all available permissions
   */
  getAllPermissions() {
    return PERMISSIONS;
  }
}

module.exports = PluginSecurity;
