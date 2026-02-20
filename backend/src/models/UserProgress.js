import pool from '../config/database.js';

export class UserProgress {
  static async enrollCourse(userId, courseId) {
    const result = await pool.query(
      `INSERT INTO user_progress (user_id, course_id, enrollment_date)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, course_id) DO UPDATE SET enrollment_date = NOW()
       RETURNING id, user_id, course_id, enrollment_date, completion_percentage, is_completed`,
      [userId, courseId]
    );
    return result.rows[0];
  }

  static async getProgress(userId, courseId) {
    const result = await pool.query(
      `SELECT * FROM user_progress WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    return result.rows[0];
  }

  static async getUserCourses(userId, limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT up.*, c.title, c.description, c.level, c.duration_hours, u.name as instructor_name
       FROM user_progress up
       JOIN courses c ON up.course_id = c.id
       JOIN users u ON c.instructor_id = u.id
       WHERE up.user_id = $1
       ORDER BY up.enrollment_date DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async markModuleComplete(userId, courseId, moduleId) {
    // First, check if module completion exists
    const existing = await pool.query(
      `SELECT id FROM user_progress WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );

    if (!existing.rows[0]) {
      throw new Error('User not enrolled in course');
    }

    // Add module to completed modules array
    const result = await pool.query(
      `UPDATE user_progress 
       SET completed_modules = array_append(completed_modules, $1)
       WHERE user_id = $2 AND course_id = $3 AND NOT completed_modules @> ARRAY[$1]
       RETURNING id, completed_modules`,
      [moduleId, userId, courseId]
    );

    // Update completion percentage
    if (result.rows[0]) {
      await this.updateCompletionPercentage(userId, courseId);
    }

    return result.rows[0];
  }

  static async updateCompletionPercentage(userId, courseId) {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT cm.id) as total_modules,
        COUNT(DISTINCT CASE WHEN up.completed_modules @> ARRAY[cm.id] THEN cm.id END) as completed_modules
       FROM courses c
       LEFT JOIN course_modules cm ON c.id = cm.course_id
       LEFT JOIN user_progress up ON c.id = up.course_id AND up.user_id = $1
       WHERE c.id = $2`,
      [userId, courseId]
    );

    const { total_modules, completed_modules } = result.rows[0];
    const percentage = total_modules > 0 ? Math.round((completed_modules / total_modules) * 100) : 0;

    const updateResult = await pool.query(
      `UPDATE user_progress 
       SET completion_percentage = $1, is_completed = $2
       WHERE user_id = $3 AND course_id = $4
       RETURNING id, completion_percentage, is_completed`,
      [percentage, percentage === 100, userId, courseId]
    );

    return updateResult.rows[0];
  }

  static async completeCourse(userId, courseId) {
    const result = await pool.query(
      `UPDATE user_progress 
       SET is_completed = true, completion_date = NOW(), completion_percentage = 100
       WHERE user_id = $1 AND course_id = $2
       RETURNING id, is_completed, completion_date`,
      [userId, courseId]
    );
    return result.rows[0];
  }

  static async getCompletedCourses(userId) {
    const result = await pool.query(
      `SELECT up.*, c.title, c.description, c.level
       FROM user_progress up
       JOIN courses c ON up.course_id = c.id
       WHERE up.user_id = $1 AND up.is_completed = true
       ORDER BY up.completion_date DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getUserStats(userId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_courses,
        COUNT(CASE WHEN is_completed THEN 1 END) as completed_courses,
        ROUND(AVG(completion_percentage)) as avg_completion,
        SUM(EXTRACT(EPOCH FROM (completion_date - enrollment_date)) / 3600) as total_hours
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}
