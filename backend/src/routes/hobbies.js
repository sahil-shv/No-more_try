const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth, optionalAuth } = require('../shared/auth');

const router = express.Router();

// Get hobby posts (public, but with optional auth for user context)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const posts = await DatabaseService.findRecentPosts(20);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching hobby posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new hobby post
router.post('/', [
  requireAuth,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('type').isIn(['text', 'image', 'audio']).withMessage('Invalid post type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, type, file_url, user_name } = req.body;
    
    const postData = {
      post_id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      user_name: user_name || 'Anonymous',
      title: title.trim(),
      content: content.trim(),
      type: type || 'text',
      file_url: file_url || null
    };

    const savedPost = await DatabaseService.create('hobby_posts', postData);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating hobby post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update hobby post (only by owner)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    
    const existingPost = await DatabaseService.findById('hobby_posts', postId, req.userId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found or you do not have permission to edit it' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();

    const savedPost = await DatabaseService.update('hobby_posts', postId, updateData, req.userId);
    res.json(savedPost);
  } catch (error) {
    console.error('Error updating hobby post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete hobby post (only by owner)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    
    const existingPost = await DatabaseService.findById('hobby_posts', postId, req.userId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found or you do not have permission to delete it' });
    }

    const deleted = await DatabaseService.delete('hobby_posts', postId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting hobby post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;