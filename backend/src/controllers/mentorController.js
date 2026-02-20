import { Mentor } from '../models/Mentor.js';
import { User } from '../models/User.js';
import pool from '../config/database.js';

export const becomeMentor = async (req, res) => {
  try {
    const { bio, expertise, availability, hourlyRate } = req.body;

    if (!bio || !expertise || !hourlyRate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already a mentor
    const existingMentor = await Mentor.findByUserId(req.user.id);
    if (existingMentor) {
      return res.status(400).json({ error: 'User is already a mentor' });
    }

    const mentor = await Mentor.create(
      req.user.id,
      bio,
      expertise,
      availability || {},
      hourlyRate
    );

    // Update user's is_mentor flag
    await User.update(req.user.id, { is_mentor: true });

    res.status(201).json(mentor);
  } catch (err) {
    console.error('Become mentor error:', err);
    res.status(500).json({ error: 'Failed to become mentor' });
  }
};

export const getMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findById(id);

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (err) {
    console.error('Get mentor error:', err);
    res.status(500).json({ error: 'Failed to get mentor' });
  }
};

export const listMentors = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const mentors = await Mentor.list(parseInt(limit), parseInt(offset));
    res.json(mentors);
  } catch (err) {
    console.error('List mentors error:', err);
    res.status(500).json({ error: 'Failed to list mentors' });
  }
};

export const searchMentors = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const mentors = await Mentor.search(q);
    res.json(mentors);
  } catch (err) {
    console.error('Search mentors error:', err);
    res.status(500).json({ error: 'Failed to search mentors' });
  }
};

export const filterMentors = async (req, res) => {
  try {
    const { expertise } = req.query;

    if (!expertise) {
      return res.status(400).json({ error: 'Expertise filter required' });
    }

    const expertiseArray = expertise.split(',');
    const mentors = await Mentor.filterByExpertise(expertiseArray);
    res.json(mentors);
  } catch (err) {
    console.error('Filter mentors error:', err);
    res.status(500).json({ error: 'Failed to filter mentors' });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, expertise, availability, hourlyRate } = req.body;

    // Check if mentor exists and belongs to user
    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    if (mentor.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedMentor = await Mentor.update(id, {
      bio,
      expertise,
      availability,
      hourly_rate: hourlyRate,
    });

    res.json(updatedMentor);
  } catch (err) {
    console.error('Update mentor error:', err);
    res.status(500).json({ error: 'Failed to update mentor' });
  }
};

export const getTopMentors = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const mentors = await Mentor.getTopMentors(parseInt(limit));
    res.json(mentors);
  } catch (err) {
    console.error('Get top mentors error:', err);
    res.status(500).json({ error: 'Failed to get top mentors' });
  }
};

export const matchMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID required' });
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Create mentor match
    const result = await pool.query(
      `INSERT INTO mentor_matches (mentee_id, mentor_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, mentee_id, mentor_id, status, created_at`,
      [req.user.id, mentorId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Match mentor error:', err);
    res.status(500).json({ error: 'Failed to match mentor' });
  }
};

export const getMentorMatches = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT mm.*, m.user_id as mentor_user_id, u.name as mentor_name, u.avatar_url as mentor_avatar
       FROM mentor_matches mm
       JOIN mentors m ON mm.mentor_id = m.id
       JOIN users u ON m.user_id = u.id
       WHERE mm.mentee_id = $1
       ORDER BY mm.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get mentor matches error:', err);
    res.status(500).json({ error: 'Failed to get mentor matches' });
  }
};
