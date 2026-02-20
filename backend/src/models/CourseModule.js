import pool from '../config/database.js';

export class CourseModule {
  static async create(courseId, title, description, order, videoUrl, duration) {
    const result = await pool.query(
      `INSERT INTO course_modules (course_id, title, description, module_order, video_url, duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, course_id, title, description, module_order, video_url, duration_minutes, created_at`,
      [courseId, title, description, order, videoUrl, duration]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM course_modules WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getByCourse(courseId) {
    const result = await pool.query(
      `SELECT * FROM course_modules WHERE course_id = $1 ORDER BY module_order ASC`,
      [courseId]
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
      `UPDATE course_modules SET ${fields.join(', ')} WHERE id = $${paramCount + 1}
       RETURNING id, course_id, title, description, module_order, video_url, duration_minutes, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM course_modules WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async getModuleCount(courseId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM course_modules WHERE course_id = $1`,
      [courseId]
    );
    return result.rows[0].count;
  }
}
