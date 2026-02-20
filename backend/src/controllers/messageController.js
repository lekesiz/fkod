import { Message } from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient ID and content required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const message = await Message.create(req.user.id, recipientId, content);
    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.getConversation(
      req.user.id,
      userId,
      parseInt(limit),
      parseInt(offset)
    );

    // Mark messages as read
    await Message.markConversationAsRead(req.user.id, userId);

    res.json(messages);
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

export const getInbox = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const messages = await Message.getInbox(req.user.id, parseInt(limit), parseInt(offset));
    res.json(messages);
  } catch (err) {
    console.error('Get inbox error:', err);
    res.status(500).json({ error: 'Failed to get inbox' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user.id);
    res.json({ unread_count: count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.markAsRead(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.delete(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
