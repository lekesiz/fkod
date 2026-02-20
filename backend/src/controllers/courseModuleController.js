import { CourseModule } from '../models/CourseModule.js';
import { Course } from '../models/Course.js';
import { UserProgress } from '../models/UserProgress.js';

export const createModule = async (req, res) => {
  try {
    const { courseId, title, description, order, videoUrl, duration } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const module = await CourseModule.create(
      courseId,
      title,
      description || '',
      order || 1,
      videoUrl || null,
      duration || 0
    );

    res.status(201).json(module);
  } catch (err) {
    console.error('Create module error:', err);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

export const getModule = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await CourseModule.findById(id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (err) {
    console.error('Get module error:', err);
    res.status(500).json({ error: 'Failed to get module' });
  }
};

export const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await CourseModule.getByCourse(courseId);
    res.json(modules);
  } catch (err) {
    console.error('Get course modules error:', err);
    res.status(500).json({ error: 'Failed to get course modules' });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order, videoUrl, duration } = req.body;

    const module = await CourseModule.findById(id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const course = await Course.findById(module.course_id);
    if (course.instructor_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedModule = await CourseModule.update(id, {
      title,
      description,
      module_order: order,
      video_url: videoUrl,
      duration_minutes: duration,
    });

    res.json(updatedModule);
  } catch (err) {
    console.error('Update module error:', err);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await CourseModule.findById(id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const course = await Course.findById(module.course_id);
    if (course.instructor_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await CourseModule.delete(id);
    res.json({ message: 'Module deleted successfully' });
  } catch (err) {
    console.error('Delete module error:', err);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

export const markModuleComplete = async (req, res) => {
  try {
    const { courseId, moduleId } = req.body;

    if (!courseId || !moduleId) {
      return res.status(400).json({ error: 'Course ID and Module ID required' });
    }

    const result = await UserProgress.markModuleComplete(req.user.id, courseId, moduleId);
    res.json(result);
  } catch (err) {
    console.error('Mark module complete error:', err);
    res.status(500).json({ error: 'Failed to mark module as complete' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const progress = await UserProgress.getProgress(req.user.id, courseId);

    if (!progress) {
      return res.status(404).json({ error: 'User not enrolled in course' });
    }

    res.json(progress);
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to get progress' });
  }
};
