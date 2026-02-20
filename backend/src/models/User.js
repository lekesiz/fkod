import pool from '../config/database.js';
import bcryptjs from 'bcryptjs';

export class User {
  static async create(email, name, age, archetypeCode) {
    const result = await pool.query(
      `INSERT INTO users (email, name, age, archetype_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, age, archetype_code, created_at`,
      [email, name, age, archetypeCode]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, email, name, age, archetype_code, bio, avatar_url, is_mentor, is_admin, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
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
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount + 1}
       RETURNING id, email, name, age, archetype_code, bio, avatar_url, is_mentor, is_admin, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async list(limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT id, email, name, age, archetype_code, bio, avatar_url, is_mentor, created_at
       FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT id, email, name, age, archetype_code, bio, avatar_url, is_mentor, created_at
       FROM users 
       WHERE name ILIKE $1 OR email ILIKE $1 OR archetype_code ILIKE $1
       ORDER BY created_at DESC LIMIT 20`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async hashPassword(password) {
    return await bcryptjs.hash(password, 10);
  }

  static async comparePassword(password, hash) {
    return await bcryptjs.compare(password, hash);
  }
}
