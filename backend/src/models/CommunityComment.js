import pool from '../config/database.js';

export class CommunityComment {
  static async create(postId, userId, content) {
    const result = await pool.query(
      `INSERT INTO community_comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, post_id, user_id, content, likes_count, created_at`,
      [postId, userId, content]
    );

    // Update post comments count
    await pool.query(
      `UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = $1`,
      [postId]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT cc.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_comments cc
       JOIN users u ON cc.user_id = u.id
       WHERE cc.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getPostComments(postId, limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT cc.*, u.name as author_name, u.avatar_url as author_avatar
       FROM community_comments cc
       JOIN users u ON cc.user_id = u.id
       WHERE cc.post_id = $1
       ORDER BY cc.created_at DESC
       LIMIT $2 OFFSET $3`,
      [postId, limit, offset]
    );
    return result.rows;
  }

  static async update(id, content) {
    const result = await pool.query(
      `UPDATE community_comments SET content = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, post_id, user_id, content, likes_count, updated_at`,
      [content, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    // Get post_id first
    const comment = await pool.query(
      `SELECT post_id FROM community_comments WHERE id = $1`,
      [id]
    );

    if (comment.rows[0]) {
      // Delete comment
      await pool.query(
        `DELETE FROM community_comments WHERE id = $1`,
        [id]
      );

      // Update post comments count
      await pool.query(
        `UPDATE community_posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = $1`,
        [comment.rows[0].post_id]
      );
    }

    return comment.rows[0];
  }

  static async addLike(commentId, userId) {
    const result = await pool.query(
      `INSERT INTO comment_likes (comment_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (comment_id, user_id) DO NOTHING
       RETURNING comment_id, user_id`,
      [commentId, userId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE community_comments SET likes_count = likes_count + 1 WHERE id = $1`,
        [commentId]
      );
    }

    return result.rows[0];
  }

  static async removeLike(commentId, userId) {
    const result = await pool.query(
      `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING comment_id`,
      [commentId, userId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE community_comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1`,
        [commentId]
      );
    }

    return result.rows[0];
  }

  static async hasUserLiked(commentId, userId) {
    const result = await pool.query(
      `SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
      [commentId, userId]
    );
    return result.rows.length > 0;
  }
}
