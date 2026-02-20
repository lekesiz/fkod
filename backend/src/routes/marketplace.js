/**
 * F-KOD Marketplace API Routes
 * Handles marketplace operations
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/marketplace/trending
 * Get trending plugins
 */
router.get('/trending', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT * FROM plugins
       WHERE status = $1
       ORDER BY downloads DESC
       LIMIT 10`,
      ['published']
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/marketplace/featured
 * Get featured plugins
 */
router.get('/featured', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT * FROM plugins
       WHERE status = $1 AND featured = true
       ORDER BY rating DESC
       LIMIT 10`,
      ['published']
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/marketplace/categories
 * Get plugin categories
 */
router.get('/categories', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT DISTINCT category, COUNT(*) as count
       FROM plugins
       WHERE status = $1
       GROUP BY category
       ORDER BY count DESC`,
      ['published']
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/marketplace/search
 * Search plugins
 */
router.get('/search', async (req, res) => {
  try {
    const { q, category, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM plugins WHERE status = $1';
    let params = ['published'];

    if (q) {
      query += ' AND (name ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 2) + ')';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    query += ' ORDER BY rating DESC, downloads DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await req.db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
