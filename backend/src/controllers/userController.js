import { User } from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, avatar_url, age } = req.body;

    // Only allow users to update their own profile
    if (req.user.id !== id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.update(id, {
      name,
      bio,
      avatar_url,
      age
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const users = await User.list(parseInt(limit), parseInt(offset));
    res.json(users);
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await User.search(q);
    res.json(users);
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow admins to delete users
    if (!req.user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const user = await User.delete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
