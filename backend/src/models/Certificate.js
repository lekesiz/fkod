import pool from '../config/database.js';

export class Certificate {
  static async issueCertificate(userId, courseId) {
    const result = await pool.query(
      `INSERT INTO certificates (user_id, course_id, issued_date, certificate_code)
       VALUES ($1, $2, NOW(), $3)
       RETURNING id, user_id, course_id, issued_date, certificate_code`,
      [userId, courseId, `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`]
    );
    return result.rows[0];
  }

  static async getUserCertificates(userId) {
    const result = await pool.query(
      `SELECT c.*, co.title as course_title, co.level, u.name as instructor_name
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       JOIN users u ON co.instructor_id = u.id
       WHERE c.user_id = $1
       ORDER BY c.issued_date DESC`,
      [userId]
    );
    return result.rows;
  }

  static async verifyCertificate(certificateCode) {
    const result = await pool.query(
      `SELECT c.*, u.name as user_name, co.title as course_title, u2.name as instructor_name
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       JOIN courses co ON c.course_id = co.id
       JOIN users u2 ON co.instructor_id = u2.id
       WHERE c.certificate_code = $1`,
      [certificateCode]
    );
    return result.rows[0];
  }

  static async getCertificate(id) {
    const result = await pool.query(
      `SELECT c.*, u.name as user_name, co.title as course_title, u2.name as instructor_name
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       JOIN courses co ON c.course_id = co.id
       JOIN users u2 ON co.instructor_id = u2.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async hasCertificate(userId, courseId) {
    const result = await pool.query(
      `SELECT id FROM certificates WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    return result.rows.length > 0;
  }
}
