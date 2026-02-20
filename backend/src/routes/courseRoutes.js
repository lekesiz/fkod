import express from 'express';
import {
  createCourse,
  getCourse,
  listCourses,
  searchCourses,
  filterCoursesByLevel,
  filterCoursesByArchetype,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getUserCourses,
  getCompletedCourses,
  getUserStats,
} from '../controllers/courseController.js';
import {
  createModule,
  getModule,
  getCourseModules,
  updateModule,
  deleteModule,
  markModuleComplete,
  getProgress,
} from '../controllers/courseModuleController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Course routes
router.post('/', verifyToken, createCourse);
router.get('/search', verifyToken, searchCourses);
router.get('/filter/level', verifyToken, filterCoursesByLevel);
router.get('/filter/archetype', verifyToken, filterCoursesByArchetype);
router.get('/my-courses', verifyToken, getUserCourses);
router.get('/completed', verifyToken, getCompletedCourses);
router.get('/stats', verifyToken, getUserStats);
router.get('/:id', verifyToken, getCourse);
router.get('/', verifyToken, listCourses);
router.put('/:id', verifyToken, updateCourse);
router.delete('/:id', verifyToken, deleteCourse);
router.post('/enroll', verifyToken, enrollCourse);

// Module routes
router.post('/:courseId/modules', verifyToken, createModule);
router.get('/:courseId/modules', verifyToken, getCourseModules);
router.get('/:courseId/modules/:moduleId', verifyToken, getModule);
router.put('/:courseId/modules/:moduleId', verifyToken, updateModule);
router.delete('/:courseId/modules/:moduleId', verifyToken, deleteModule);
router.post('/:courseId/modules/:moduleId/complete', verifyToken, markModuleComplete);
router.get('/:courseId/progress', verifyToken, getProgress);

export default router;
