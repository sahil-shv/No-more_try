const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user habits
router.get('/', requireAuth, async (req, res) => {
  try {
    const habits = await DatabaseService.findByUserId('habits', req.userId);
    // Parse completed_dates JSON for each habit
    const parsedHabits = habits.map(habit => ({
      ...habit,
      completed_dates: JSON.parse(habit.completed_dates || '[]')
    }));
    res.json(parsedHabits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new habit
router.post('/', [
  requireAuth,
  body('name').notEmpty().withMessage('Habit name is required'),
  body('category').isIn(['study', 'health', 'finance', 'recovery']).withMessage('Invalid category'),
  body('frequency').isIn(['daily', 'weekly']).withMessage('Invalid frequency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, frequency } = req.body;
    
    const habitData = {
      habit_id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      name: name.trim(),
      category,
      description: description?.trim() || '',
      frequency: frequency || 'daily',
      completed_dates: JSON.stringify([])
    };

    const savedHabit = await DatabaseService.create('habits', habitData);
    savedHabit.completed_dates = JSON.parse(savedHabit.completed_dates || '[]');
    res.status(201).json(savedHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update habit
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const habitId = req.params.id;
    const { name, description, category, frequency, completed_dates } = req.body;
    
    const existingHabit = await DatabaseService.findById('habits', habitId, req.userId);
    if (!existingHabit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (completed_dates !== undefined) updateData.completed_dates = JSON.stringify(completed_dates);

    const savedHabit = await DatabaseService.update('habits', habitId, updateData, req.userId);
    if (savedHabit) {
      savedHabit.completed_dates = JSON.parse(savedHabit.completed_dates || '[]');
    }
    res.json(savedHabit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete habit
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const habitId = req.params.id;
    
    const existingHabit = await DatabaseService.findById('habits', habitId, req.userId);
    if (!existingHabit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const deleted = await DatabaseService.delete('habits', habitId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Habit not found' });
    }
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;