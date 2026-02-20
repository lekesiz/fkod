import pool from '../config/database.js';

export class Event {
  static async create(organizerId, title, description, eventDate, location, capacity, eventType) {
    const result = await pool.query(
      `INSERT INTO events (organizer_id, title, description, event_date, location, capacity, event_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, organizer_id, title, description, event_date, location, capacity, event_type, attendees_count, created_at`,
      [organizerId, title, description, eventDate, location, capacity, eventType]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async list(limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.event_date > NOW()
       ORDER BY e.event_date ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.title ILIKE $1 OR e.description ILIKE $1
       ORDER BY e.event_date ASC
       LIMIT 20`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async filterByType(eventType) {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.event_type = $1 AND e.event_date > NOW()
       ORDER BY e.event_date ASC`,
      [eventType]
    );
    return result.rows;
  }

  static async getUpcomingEvents(limit = 10) {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.event_date > NOW()
       ORDER BY e.event_date ASC
       LIMIT $1`,
      [limit]
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
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramCount + 1}
       RETURNING id, organizer_id, title, description, event_date, location, capacity, event_type, attendees_count, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM events WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async registerAttendee(eventId, userId) {
    const result = await pool.query(
      `INSERT INTO event_attendees (event_id, user_id, registered_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (event_id, user_id) DO NOTHING
       RETURNING event_id, user_id, registered_at`,
      [eventId, userId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE events SET attendees_count = attendees_count + 1 WHERE id = $1`,
        [eventId]
      );
    }

    return result.rows[0];
  }

  static async unregisterAttendee(eventId, userId) {
    const result = await pool.query(
      `DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2 RETURNING event_id`,
      [eventId, userId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE events SET attendees_count = GREATEST(0, attendees_count - 1) WHERE id = $1`,
        [eventId]
      );
    }

    return result.rows[0];
  }

  static async getEventAttendees(eventId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, ea.registered_at
       FROM event_attendees ea
       JOIN users u ON ea.user_id = u.id
       WHERE ea.event_id = $1
       ORDER BY ea.registered_at DESC
       LIMIT $2 OFFSET $3`,
      [eventId, limit, offset]
    );
    return result.rows;
  }

  static async getUserEvents(userId, limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM event_attendees ea
       JOIN events e ON ea.event_id = e.id
       JOIN users u ON e.organizer_id = u.id
       WHERE ea.user_id = $1
       ORDER BY e.event_date DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async hasUserRegistered(eventId, userId) {
    const result = await pool.query(
      `SELECT id FROM event_attendees WHERE event_id = $1 AND user_id = $2`,
      [eventId, userId]
    );
    return result.rows.length > 0;
  }
}
