import pool from '../config/database.js';

export class Course {
  static async create(title, description, instructorId, level, targetArchetypes, duration) {
    const result = await pool.query(
      `INSERT INTO courses (title, description, instructor_id, level, target_archetypes, duration_hours)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, instructor_id, level, target_archetypes, duration_hours, created_at`,
      [title, description, instructorId, level, targetArchetypes, duration]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT c.*, u.name as instructor_name, u.avatar_url as instructor_avatar
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async list(limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT c.*, u.name as instructor_name, u.avatar_url as instructor_avatar
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       ORDER BY c.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT c.*, u.name as instructor_name, u.avatar_url as instructor_avatar
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.title ILIKE $1 OR c.description ILIKE $1
       ORDER BY c.created_at DESC
       LIMIT 20`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async filterByLevel(level) {
    const result = await pool.query(
      `SELECT c.*, u.name as instructor_name, u.avatar_url as instructor_avatar
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.level = $1
       ORDER BY c.created_at DESC`,
      [level]
    );
    return result.rows;
  }

  static async filterByArchetype(archetype) {
    const result = await pool.query(
      `SELECT c.*, u.name as instructor_name, u.avatar_url as instructor_avatar
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.target_archetypes && $1
       ORDER BY c.created_at DESC`,
      [archetype]
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
      `UPDATE courses SET ${fields.join(', ')} WHERE id = $${paramCount + 1}
       RETURNING id, title, description, instructor_id, level, target_archetypes, duration_hours, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM courses WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async getEnrollmentCount(courseId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM user_progress WHERE course_id = $1`,
      [courseId]
    );
    return result.rows[0].count;
  }
}
