const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user stress logs
router.get('/', requireAuth, async (req, res) => {
  try {
    const stressLogs = await DatabaseService.findByUserId('stress_logs', req.userId);
    // Parse stress_factors JSON for each log
    const parsedLogs = stressLogs.map(log => ({
      ...log,
      stress_factors: JSON.parse(log.stress_factors || '[]')
    }));
    res.json(parsedLogs);
  } catch (error) {
    console.error('Error fetching stress logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new stress log
router.post('/', [
  requireAuth,
  body('date').isISO8601().withMessage('Valid date is required'),
  body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
  body('fatigue').isInt({ min: 1, max: 5 }).withMessage('Fatigue must be between 1 and 5'),
  body('study_duration').isFloat({ min: 0 }).withMessage('Study duration must be a positive number'),
  body('stress_factors').isArray().withMessage('Stress factors must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, mood, fatigue, study_duration, stress_factors, notes } = req.body;
    
    // Check if log already exists for this date
    const existingLog = await DatabaseService.findByUserIdAndDate('stress_logs', req.userId, date);
    if (existingLog) {
      return res.status(400).json({ error: 'Stress log already exists for this date' });
    }
    
    const logData = {
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      date,
      mood,
      fatigue,
      study_duration: study_duration || 0,
      stress_factors: JSON.stringify(stress_factors || []),
      notes: notes?.trim() || ''
    };

    const savedLog = await DatabaseService.create('stress_logs', logData);
    savedLog.stress_factors = JSON.parse(savedLog.stress_factors || '[]');
    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error creating stress log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update stress log
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const logId = req.params.id;
    const { mood, fatigue, study_duration, stress_factors, notes } = req.body;
    
    const existingLog = await DatabaseService.findById('stress_logs', logId, req.userId);
    if (!existingLog) {
      return res.status(404).json({ error: 'Stress log not found' });
    }

    const updateData = {};
    if (mood !== undefined) updateData.mood = mood;
    if (fatigue !== undefined) updateData.fatigue = fatigue;
    if (study_duration !== undefined) updateData.study_duration = study_duration;
    if (stress_factors !== undefined) updateData.stress_factors = JSON.stringify(stress_factors);
    if (notes !== undefined) updateData.notes = notes.trim();

    const savedLog = await DatabaseService.update('stress_logs', logId, updateData, req.userId);
    if (savedLog) {
      savedLog.stress_factors = JSON.parse(savedLog.stress_factors || '[]');
    }
    res.json(savedLog);
  } catch (error) {
    console.error('Error updating stress log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete stress log
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const logId = req.params.id;
    
    const existingLog = await DatabaseService.findById('stress_logs', logId, req.userId);
    if (!existingLog) {
      return res.status(404).json({ error: 'Stress log not found' });
    }

    const deleted = await DatabaseService.delete('stress_logs', logId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Stress log not found' });
    }
  } catch (error) {
    console.error('Error deleting stress log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;