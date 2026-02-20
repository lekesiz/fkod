import express from 'express';
import {
  createEvent,
  getEvent,
  listEvents,
  searchEvents,
  filterEventsByType,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventAttendees,
  getUserEvents,
} from '../controllers/eventController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createEvent);
router.get('/upcoming', getUpcomingEvents);
router.get('/search', verifyToken, searchEvents);
router.get('/filter/type', verifyToken, filterEventsByType);
router.get('/my-events', verifyToken, getUserEvents);
router.get('/:id', verifyToken, getEvent);
router.get('/:id/attendees', verifyToken, getEventAttendees);
router.get('/', verifyToken, listEvents);
router.put('/:id', verifyToken, updateEvent);
router.delete('/:id', verifyToken, deleteEvent);
router.post('/register', verifyToken, registerForEvent);
router.post('/unregister', verifyToken, unregisterFromEvent);

export default router;
