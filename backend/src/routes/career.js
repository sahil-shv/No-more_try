const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user career tasks
router.get('/', requireAuth, async (req, res) => {
  try {
    const careerTasks = await DatabaseService.findByUserId('career_tasks', req.userId);
    res.json(careerTasks);
  } catch (error) {
    console.error('Error fetching career tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new career task
router.post('/', [
  requireAuth,
  body('title').notEmpty().withMessage('Task title is required'),
  body('category').isIn(['skill-building', 'exploration', 'networking', 'portfolio']).withMessage('Invalid category'),
  body('estimated_time').optional().isInt({ min: 1 }).withMessage('Estimated time must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, estimated_time, category } = req.body;
    
    const taskData = {
      task_id: `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      title: title.trim(),
      description: description?.trim() || '',
      estimated_time: estimated_time || 30,
      completed: false,
      category
    };

    const savedTask = await DatabaseService.create('career_tasks', taskData);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating career task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update career task
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, estimated_time, completed, category } = req.body;
    
    const existingTask = await DatabaseService.findById('career_tasks', taskId, req.userId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Career task not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (estimated_time !== undefined) updateData.estimated_time = estimated_time;
    if (completed !== undefined) updateData.completed = completed;
    if (category !== undefined) updateData.category = category;

    const savedTask = await DatabaseService.update('career_tasks', taskId, updateData, req.userId);
    res.json(savedTask);
  } catch (error) {
    console.error('Error updating career task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete career task
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const existingTask = await DatabaseService.findById('career_tasks', taskId, req.userId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Career task not found' });
    }

    const deleted = await DatabaseService.delete('career_tasks', taskId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Career task not found' });
    }
  } catch (error) {
    console.error('Error deleting career task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;