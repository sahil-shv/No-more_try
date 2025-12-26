const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user goals
router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await DatabaseService.findByUserId('goals', req.userId);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new goal
router.post('/', [
  requireAuth,
  body('title').notEmpty().withMessage('Title is required'),
  body('category').isIn(['academic', 'career', 'personal']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category } = req.body;
    
    // Check active goals limit (prevent overload)
    const existingGoals = await DatabaseService.findByUserId('goals', req.userId);
    const activeGoals = existingGoals.filter(g => g.status === 'active');
    
    if (activeGoals.length >= 5) {
      return res.status(400).json({ 
        error: 'You have reached the maximum number of active goals (5). Consider completing or pausing some goals first.' 
      });
    }

    // Create goal object
    const goalData = {
      goal_id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      title: title.trim(),
      description: description?.trim() || '',
      category,
      status: 'active'
    };

    const savedGoal = await DatabaseService.create('goals', goalData);
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update goal
router.put('/:id', [
  requireAuth,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('category').optional().isIn(['academic', 'career', 'personal']).withMessage('Invalid category'),
  body('status').optional().isIn(['active', 'paused', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goalId = req.params.id;
    const { title, description, category, status } = req.body;
    
    // Get existing goal
    const existingGoal = await DatabaseService.findById('goals', goalId, req.userId);
    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Update goal object
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;

    const savedGoal = await DatabaseService.update('goals', goalId, updateData, req.userId);
    res.json(savedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete goal
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const goalId = req.params.id;
    
    // Verify goal exists and belongs to user
    const existingGoal = await DatabaseService.findById('goals', goalId, req.userId);
    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const deleted = await DatabaseService.delete('goals', goalId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Goal not found' });
    }
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;