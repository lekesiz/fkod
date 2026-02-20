import express from 'express';
import {
  becomeMentor,
  getMentor,
  listMentors,
  searchMentors,
  filterMentors,
  updateMentor,
  getTopMentors,
  matchMentor,
  getMentorMatches,
} from '../controllers/mentorController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, becomeMentor);
router.get('/top', getTopMentors);
router.get('/search', verifyToken, searchMentors);
router.get('/filter', verifyToken, filterMentors);
router.get('/matches', verifyToken, getMentorMatches);
router.get('/:id', verifyToken, getMentor);
router.get('/', verifyToken, listMentors);
router.put('/:id', verifyToken, updateMentor);
router.post('/match', verifyToken, matchMentor);

export default router;
