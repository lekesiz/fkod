import pool from '../config/database.js';

export class Message {
  static async create(senderId, recipientId, content) {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, recipient_id, content, read, created_at`,
      [senderId, recipientId, content]
    );
    return result.rows[0];
  }

  static async getConversation(userId1, userId2, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = $1 AND m.recipient_id = $2) OR (m.sender_id = $2 AND m.recipient_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId1, userId2, limit, offset]
    );
    return result.rows;
  }

  static async getInbox(userId, limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT DISTINCT ON (sender_id) m.*, u.name as sender_name, u.avatar_url as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.recipient_id = $1
       ORDER BY m.sender_id, m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async markAsRead(messageId) {
    const result = await pool.query(
      `UPDATE messages SET read = true WHERE id = $1 RETURNING id, read`,
      [messageId]
    );
    return result.rows[0];
  }

  static async markConversationAsRead(userId, senderId) {
    const result = await pool.query(
      `UPDATE messages SET read = true 
       WHERE recipient_id = $1 AND sender_id = $2 AND read = false
       RETURNING id`,
      [userId, senderId]
    );
    return result.rows;
  }

  static async getUnreadCount(userId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM messages WHERE recipient_id = $1 AND read = false`,
      [userId]
    );
    return result.rows[0].count;
  }

  static async delete(messageId) {
    const result = await pool.query(
      `DELETE FROM messages WHERE id = $1 RETURNING id`,
      [messageId]
    );
    return result.rows[0];
  }
}
