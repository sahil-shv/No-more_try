const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user focus sessions
router.get('/', requireAuth, async (req, res) => {
  try {
    const sessions = await DatabaseService.findByUserId('focus_sessions', req.userId);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching focus sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new focus session
router.post('/', [
  requireAuth,
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('type').isIn(['study', 'break', 'deep-work']).withMessage('Invalid session type'),
  body('start_time').isISO8601().withMessage('Valid start time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { duration, type, start_time, end_time, completed } = req.body;
    
    const sessionData = {
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      duration,
      type,
      start_time,
      end_time: end_time || null,
      completed: completed || false
    };

    const savedSession = await DatabaseService.create('focus_sessions', sessionData);
    res.status(201).json(savedSession);
  } catch (error) {
    console.error('Error creating focus session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update focus session
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { end_time, completed } = req.body;
    
    const existingSession = await DatabaseService.findById('focus_sessions', sessionId, req.userId);
    if (!existingSession) {
      return res.status(404).json({ error: 'Focus session not found' });
    }

    const updateData = {};
    if (end_time !== undefined) updateData.end_time = end_time;
    if (completed !== undefined) updateData.completed = completed;

    const savedSession = await DatabaseService.update('focus_sessions', sessionId, updateData, req.userId);
    res.json(savedSession);
  } catch (error) {
    console.error('Error updating focus session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete focus session
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const existingSession = await DatabaseService.findById('focus_sessions', sessionId, req.userId);
    if (!existingSession) {
      return res.status(404).json({ error: 'Focus session not found' });
    }

    const deleted = await DatabaseService.delete('focus_sessions', sessionId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Focus session not found' });
    }
  } catch (error) {
    console.error('Error deleting focus session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;