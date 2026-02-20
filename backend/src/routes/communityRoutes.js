import express from 'express';
import {
  createPost,
  getPost,
  listPosts,
  searchPosts,
  filterPostsByTag,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getTrendingPosts,
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from '../controllers/communityController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Post routes
router.post('/posts', verifyToken, createPost);
router.get('/posts/trending', getTrendingPosts);
router.get('/posts/search', verifyToken, searchPosts);
router.get('/posts/filter/tag', verifyToken, filterPostsByTag);
router.get('/posts/user/:userId', verifyToken, getUserPosts);
router.get('/posts/:id', verifyToken, getPost);
router.get('/posts', verifyToken, listPosts);
router.put('/posts/:id', verifyToken, updatePost);
router.delete('/posts/:id', verifyToken, deletePost);
router.post('/posts/like', verifyToken, likePost);
router.post('/posts/unlike', verifyToken, unlikePost);

// Comment routes
router.post('/comments', verifyToken, createComment);
router.get('/posts/:postId/comments', verifyToken, getPostComments);
router.put('/comments/:id', verifyToken, updateComment);
router.delete('/comments/:id', verifyToken, deleteComment);
router.post('/comments/like', verifyToken, likeComment);
router.post('/comments/unlike', verifyToken, unlikeComment);

export default router;
