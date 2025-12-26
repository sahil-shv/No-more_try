const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user tasks
router.get('/', requireAuth, async (req, res) => {
  try {
    const tasks = await DatabaseService.findByUserId('tasks', req.userId);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new task
router.post('/', [
  requireAuth,
  body('title').notEmpty().withMessage('Task title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, due_date, priority, linked_goal_id, linked_habit_id } = req.body;
    
    const taskData = {
      task_id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      due_date: due_date || null,
      priority: priority || 'medium',
      linked_goal_id: linked_goal_id || null,
      linked_habit_id: linked_habit_id || null
    };

    const savedTask = await DatabaseService.create('tasks', taskData);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, completed, due_date, priority, linked_goal_id, linked_habit_id } = req.body;
    
    const existingTask = await DatabaseService.findById('tasks', taskId, req.userId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (priority !== undefined) updateData.priority = priority;
    if (linked_goal_id !== undefined) updateData.linked_goal_id = linked_goal_id;
    if (linked_habit_id !== undefined) updateData.linked_habit_id = linked_habit_id;

    const savedTask = await DatabaseService.update('tasks', taskId, updateData, req.userId);
    res.json(savedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const existingTask = await DatabaseService.findById('tasks', taskId, req.userId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleted = await DatabaseService.delete('tasks', taskId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;