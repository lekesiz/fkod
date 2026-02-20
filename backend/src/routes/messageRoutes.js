import express from 'express';
import {
  sendMessage,
  getConversation,
  getInbox,
  getUnreadCount,
  markAsRead,
  deleteMessage,
} from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.get('/inbox', verifyToken, getInbox);
router.get('/unread', verifyToken, getUnreadCount);
router.get('/:userId', verifyToken, getConversation);
router.put('/:messageId/read', verifyToken, markAsRead);
router.delete('/:messageId', verifyToken, deleteMessage);

export default router;
