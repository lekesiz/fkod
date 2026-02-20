import express from 'express';
import { getUser, updateUser, listUsers, searchUsers, deleteUser } from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, listUsers);
router.get('/search', verifyToken, searchUsers);
router.get('/:id', verifyToken, getUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

export default router;
