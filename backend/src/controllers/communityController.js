import { CommunityPost } from '../models/CommunityPost.js';
import { CommunityComment } from '../models/CommunityComment.js';

// Post Controllers
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const post = await CommunityPost.create(req.user.id, title, content, tags || []);
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Failed to get post' });
  }
};

export const listPosts = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const posts = await CommunityPost.list(parseInt(limit), parseInt(offset));
    res.json(posts);
  } catch (err) {
    console.error('List posts error:', err);
    res.status(500).json({ error: 'Failed to list posts' });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const posts = await CommunityPost.search(q);
    res.json(posts);
  } catch (err) {
    console.error('Search posts error:', err);
    res.status(500).json({ error: 'Failed to search posts' });
  }
};

export const filterPostsByTag = async (req, res) => {
  try {
    const { tag } = req.query;

    if (!tag) {
      return res.status(400).json({ error: 'Tag filter required' });
    }

    const posts = await CommunityPost.filterByTag(tag);
    res.json(posts);
  } catch (err) {
    console.error('Filter posts error:', err);
    res.status(500).json({ error: 'Failed to filter posts' });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    const posts = await CommunityPost.getUserPosts(userId, parseInt(limit), parseInt(offset));
    res.json(posts);
  } catch (err) {
    console.error('Get user posts error:', err);
    res.status(500).json({ error: 'Failed to get user posts' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedPost = await CommunityPost.update(id, { title, content, tags });
    res.json(updatedPost);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await CommunityPost.delete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID required' });
    }

    const result = await CommunityPost.addLike(postId, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID required' });
    }

    const result = await CommunityPost.removeLike(postId, req.user.id);
    res.json(result);
  } catch (err) {
    console.error('Unlike post error:', err);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const posts = await CommunityPost.getTrendingPosts(parseInt(limit));
    res.json(posts);
  } catch (err) {
    console.error('Get trending posts error:', err);
    res.status(500).json({ error: 'Failed to get trending posts' });
  }
};

// Comment Controllers
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content required' });
    }

    const comment = await CommunityComment.create(postId, req.user.id, content);
    res.status(201).json(comment);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    const comments = await CommunityComment.getPostComments(postId, parseInt(limit), parseInt(offset));
    res.json(comments);
  } catch (err) {
    console.error('Get post comments error:', err);
    res.status(500).json({ error: 'Failed to get post comments' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    const comment = await CommunityComment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedComment = await CommunityComment.update(id, content);
    res.json(updatedComment);
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await CommunityComment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await CommunityComment.delete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({ error: 'Comment ID required' });
    }

    const result = await CommunityComment.addLike(commentId, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    console.error('Like comment error:', err);
    res.status(500).json({ error: 'Failed to like comment' });
  }
};

export const unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({ error: 'Comment ID required' });
    }

    const result = await CommunityComment.removeLike(commentId, req.user.id);
    res.json(result);
  } catch (err) {
    console.error('Unlike comment error:', err);
    res.status(500).json({ error: 'Failed to unlike comment' });
  }
};
