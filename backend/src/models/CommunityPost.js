import pool from '../config/database.js';

export class CommunityPost {
  static async create(userId, title, content, tags = []) {
    const result = await pool.query(
      `INSERT INTO community_posts (user_id, title, content, tags)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, title, content, tags, likes_count, comments_count, created_at`,
      [userId, title, content, tags]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT cp.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async list(limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT cp.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       ORDER BY cp.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT cp.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.title ILIKE $1 OR cp.content ILIKE $1
       ORDER BY cp.created_at DESC
       LIMIT 20`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async filterByTag(tag) {
    const result = await pool.query(
      `SELECT cp.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.tags && $1
       ORDER BY cp.created_at DESC`,
      [[tag]]
    );
    return result.rows;
  }

  static async getUserPosts(userId, limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT cp.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.user_id = $1
       ORDER BY cp.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    values.push(id);

    const result = await pool.query(
      `UPDATE community_posts SET ${fields.join(', ')} WHERE id = $${paramCount + 1}
       RETURNING id, user_id, title, content, tags, likes_count, comments_count, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM community_posts WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async addLike(postId, userId) {
    const result = await pool.query(
      `INSERT INTO post_likes (post_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING
       RETURNING post_id, user_id`,
      [postId, userId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = $1`,
        [postId]
      );
    }

    return result.rows[0];
  }

  static async removeLike(postId, userId) {
    const result = await pool.query(
      `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2 RETURNING post_id`,
      [postId, userId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE community_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1`,
        [postId]
      );
    }

    return result.rows[0];
  }

  static async hasUserLiked(postId, userId) {
    const result = await pool.query(
      `SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    return result.rows.length > 0;
  }

  static async getTrendingPosts(limit = 10) {
    const result = await pool.query(
      `SELECT cp.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       ORDER BY cp.likes_count DESC, cp.comments_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}
