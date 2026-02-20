import pool from '../config/database.js';

export class Mentor {
  static async create(userId, bio, expertise, availability, hourlyRate) {
    const result = await pool.query(
      `INSERT INTO mentors (user_id, bio, expertise, availability, hourly_rate)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, bio, expertise, availability, hourly_rate, rating, reviews_count, created_at`,
      [userId, bio, expertise, availability, hourlyRate]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT m.*, u.name, u.email, u.archetype_code, u.avatar_url
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM mentors WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async list(limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT m.*, u.name, u.email, u.archetype_code, u.avatar_url
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       ORDER BY m.rating DESC, m.reviews_count DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT m.*, u.name, u.email, u.archetype_code, u.avatar_url
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE u.name ILIKE $1 OR u.email ILIKE $1 OR m.expertise::text ILIKE $1
       ORDER BY m.rating DESC
       LIMIT 20`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async filterByExpertise(expertise) {
    const result = await pool.query(
      `SELECT m.*, u.name, u.email, u.archetype_code, u.avatar_url
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE m.expertise && $1
       ORDER BY m.rating DESC
       LIMIT 20`,
      [expertise]
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
      `UPDATE mentors SET ${fields.join(', ')} WHERE id = $${paramCount + 1}
       RETURNING id, user_id, bio, expertise, availability, hourly_rate, rating, reviews_count, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async updateRating(id, newRating, reviewsCount) {
    const result = await pool.query(
      `UPDATE mentors SET rating = $1, reviews_count = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, rating, reviews_count`,
      [newRating, reviewsCount, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM mentors WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async getTopMentors(limit = 10) {
    const result = await pool.query(
      `SELECT m.*, u.name, u.email, u.archetype_code, u.avatar_url
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE m.rating > 0
       ORDER BY m.rating DESC, m.reviews_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}
