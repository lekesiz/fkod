import { Course } from '../models/Course.js';
import { CourseModule } from '../models/CourseModule.js';
import { UserProgress } from '../models/UserProgress.js';

export const createCourse = async (req, res) => {
  try {
    const { title, description, level, targetArchetypes, duration } = req.body;

    if (!title || !description || !level) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const course = await Course.create(
      title,
      description,
      req.user.id,
      level,
      targetArchetypes || [],
      duration || 0
    );

    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const modules = await CourseModule.getByCourse(id);
    const enrollmentCount = await Course.getEnrollmentCount(id);

    res.json({
      ...course,
      modules,
      enrollment_count: enrollmentCount,
    });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Failed to get course' });
  }
};

export const listCourses = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const courses = await Course.list(parseInt(limit), parseInt(offset));
    res.json(courses);
  } catch (err) {
    console.error('List courses error:', err);
    res.status(500).json({ error: 'Failed to list courses' });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const courses = await Course.search(q);
    res.json(courses);
  } catch (err) {
    console.error('Search courses error:', err);
    res.status(500).json({ error: 'Failed to search courses' });
  }
};

export const filterCoursesByLevel = async (req, res) => {
  try {
    const { level } = req.query;

    if (!level) {
      return res.status(400).json({ error: 'Level filter required' });
    }

    const courses = await Course.filterByLevel(level);
    res.json(courses);
  } catch (err) {
    console.error('Filter courses error:', err);
    res.status(500).json({ error: 'Failed to filter courses' });
  }
};

export const filterCoursesByArchetype = async (req, res) => {
  try {
    const { archetype } = req.query;

    if (!archetype) {
      return res.status(400).json({ error: 'Archetype filter required' });
    }

    const courses = await Course.filterByArchetype([archetype]);
    res.json(courses);
  } catch (err) {
    console.error('Filter courses error:', err);
    res.status(500).json({ error: 'Failed to filter courses' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, level, targetArchetypes, duration } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedCourse = await Course.update(id, {
      title,
      description,
      level,
      target_archetypes: targetArchetypes,
      duration_hours: duration,
    });

    res.json(updatedCourse);
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Course.delete(id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progress = await UserProgress.enrollCourse(req.user.id, courseId);
    res.status(201).json(progress);
  } catch (err) {
    console.error('Enroll course error:', err);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

export const getUserCourses = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const courses = await UserProgress.getUserCourses(req.user.id, parseInt(limit), parseInt(offset));
    res.json(courses);
  } catch (err) {
    console.error('Get user courses error:', err);
    res.status(500).json({ error: 'Failed to get user courses' });
  }
};

export const getCompletedCourses = async (req, res) => {
  try {
    const courses = await UserProgress.getCompletedCourses(req.user.id);
    res.json(courses);
  } catch (err) {
    console.error('Get completed courses error:', err);
    res.status(500).json({ error: 'Failed to get completed courses' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const stats = await UserProgress.getUserStats(req.user.id);
    res.json(stats);
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};
