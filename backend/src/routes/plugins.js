/**
 * F-KOD Plugin API Routes
 * Handles plugin management, installation, and marketplace
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Plugin Management Routes

/**
 * GET /api/plugins
 * Get all plugins
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM plugins WHERE status = $1';
    let params = ['published'];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (search) {
      query += ' AND (name ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 2) + ')';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY downloads DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await req.db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/plugins/:id
 * Get plugin details
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM plugins WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/plugins
 * Create a new plugin (developers only)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, category, version } = req.body;

    const result = await req.db.query(
      `INSERT INTO plugins (developer_id, name, slug, description, category, version, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, name, name.toLowerCase().replace(/\s+/g, '-'), description, category, version, 'draft']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/plugins/:id
 * Update plugin (developer only)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, category, version, icon_url, banner_url } = req.body;

    // Check if user is plugin developer
    const pluginResult = await req.db.query(
      'SELECT * FROM plugins WHERE id = $1',
      [req.params.id]
    );

    if (pluginResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    if (pluginResult.rows[0].developer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await req.db.query(
      `UPDATE plugins
       SET name = $1, description = $2, category = $3, version = $4, icon_url = $5, banner_url = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, category, version, icon_url, banner_url, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/plugins/:id/publish
 * Publish plugin
 */
router.post('/:id/publish', authenticate, async (req, res) => {
  try {
    const pluginResult = await req.db.query(
      'SELECT * FROM plugins WHERE id = $1',
      [req.params.id]
    );

    if (pluginResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    if (pluginResult.rows[0].developer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await req.db.query(
      'UPDATE plugins SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      ['published', req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/plugins/:id/install
 * Install plugin for tenant
 */
router.post('/:id/install', authenticate, async (req, res) => {
  try {
    const { tenantId } = req.body;

    // Check if plugin exists
    const pluginResult = await req.db.query(
      'SELECT * FROM plugins WHERE id = $1 AND status = $2',
      [req.params.id, 'published']
    );

    if (pluginResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    // Check if already installed
    const existingResult = await req.db.query(
      'SELECT * FROM plugin_installations WHERE plugin_id = $1 AND tenant_id = $2',
      [req.params.id, tenantId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Plugin already installed' });
    }

    // Create installation
    const result = await req.db.query(
      `INSERT INTO plugin_installations (plugin_id, tenant_id, version, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.params.id, tenantId, pluginResult.rows[0].version, 'active']
    );

    // Update download count
    await req.db.query(
      'UPDATE plugins SET downloads = downloads + 1 WHERE id = $1',
      [req.params.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/plugins/:id/uninstall
 * Uninstall plugin for tenant
 */
router.post('/:id/uninstall', authenticate, async (req, res) => {
  try {
    const { tenantId } = req.body;

    const result = await req.db.query(
      'DELETE FROM plugin_installations WHERE plugin_id = $1 AND tenant_id = $2 RETURNING *',
      [req.params.id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Installation not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/plugins/:id/reviews
 * Get plugin reviews
 */
router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT pr.*, u.name, u.avatar_url
       FROM plugin_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.plugin_id = $1
       ORDER BY pr.created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/plugins/:id/reviews
 * Create plugin review
 */
router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const { rating, title, review } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const result = await req.db.query(
      `INSERT INTO plugin_reviews (plugin_id, user_id, rating, title, review)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.params.id, req.user.id, rating, title, review]
    );

    // Update plugin rating
    const ratingResult = await req.db.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as count
       FROM plugin_reviews
       WHERE plugin_id = $1`,
      [req.params.id]
    );

    await req.db.query(
      'UPDATE plugins SET rating = $1, review_count = $2 WHERE id = $3',
      [ratingResult.rows[0].avg_rating, ratingResult.rows[0].count, req.params.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
