const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user reflections
router.get('/', requireAuth, async (req, res) => {
  try {
    const reflections = await DatabaseService.findByUserId('weekly_reflections', req.userId);
    // Parse JSON fields for each reflection
    const parsedReflections = reflections.map(reflection => ({
      ...reflection,
      goals_data: JSON.parse(reflection.goals_data || '{}'),
      habits_data: JSON.parse(reflection.habits_data || '{}'),
      tasks_data: JSON.parse(reflection.tasks_data || '{}'),
      stress_data: JSON.parse(reflection.stress_data || '{}'),
      finance_data: JSON.parse(reflection.finance_data || '{}'),
      hobbies_data: JSON.parse(reflection.hobbies_data || '{}'),
      overall_data: JSON.parse(reflection.overall_data || '{}')
    }));
    res.json(parsedReflections);
  } catch (error) {
    console.error('Error fetching reflections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new weekly reflection
router.post('/', [
  requireAuth,
  body('week_start_date').isISO8601().withMessage('Valid week start date is required'),
  body('goals_data').isObject().withMessage('Goals data must be an object'),
  body('habits_data').isObject().withMessage('Habits data must be an object'),
  body('tasks_data').isObject().withMessage('Tasks data must be an object'),
  body('stress_data').isObject().withMessage('Stress data must be an object'),
  body('finance_data').isObject().withMessage('Finance data must be an object'),
  body('hobbies_data').isObject().withMessage('Hobbies data must be an object'),
  body('overall_data').isObject().withMessage('Overall data must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      week_start_date,
      goals_data,
      habits_data,
      tasks_data,
      stress_data,
      finance_data,
      hobbies_data,
      overall_data
    } = req.body;
    
    // Check if reflection already exists for this week
    const existingReflection = await DatabaseService.query(
      'SELECT * FROM weekly_reflections WHERE user_id = $1 AND week_start_date = $2',
      [req.userId, week_start_date]
    );
    
    if (existingReflection.length > 0) {
      return res.status(400).json({ error: 'Reflection already exists for this week' });
    }
    
    const reflectionData = {
      reflection_id: `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      week_start_date,
      goals_data: JSON.stringify(goals_data || {}),
      habits_data: JSON.stringify(habits_data || {}),
      tasks_data: JSON.stringify(tasks_data || {}),
      stress_data: JSON.stringify(stress_data || {}),
      finance_data: JSON.stringify(finance_data || {}),
      hobbies_data: JSON.stringify(hobbies_data || {}),
      overall_data: JSON.stringify(overall_data || {})
    };

    const savedReflection = await DatabaseService.create('weekly_reflections', reflectionData);
    
    // Parse JSON fields for response
    savedReflection.goals_data = JSON.parse(savedReflection.goals_data || '{}');
    savedReflection.habits_data = JSON.parse(savedReflection.habits_data || '{}');
    savedReflection.tasks_data = JSON.parse(savedReflection.tasks_data || '{}');
    savedReflection.stress_data = JSON.parse(savedReflection.stress_data || '{}');
    savedReflection.finance_data = JSON.parse(savedReflection.finance_data || '{}');
    savedReflection.hobbies_data = JSON.parse(savedReflection.hobbies_data || '{}');
    savedReflection.overall_data = JSON.parse(savedReflection.overall_data || '{}');
    
    res.status(201).json(savedReflection);
  } catch (error) {
    console.error('Error creating reflection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update weekly reflection
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const reflectionId = req.params.id;
    const {
      goals_data,
      habits_data,
      tasks_data,
      stress_data,
      finance_data,
      hobbies_data,
      overall_data
    } = req.body;
    
    const existingReflection = await DatabaseService.findById('weekly_reflections', reflectionId, req.userId);
    if (!existingReflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }

    const updateData = {};
    if (goals_data !== undefined) updateData.goals_data = JSON.stringify(goals_data);
    if (habits_data !== undefined) updateData.habits_data = JSON.stringify(habits_data);
    if (tasks_data !== undefined) updateData.tasks_data = JSON.stringify(tasks_data);
    if (stress_data !== undefined) updateData.stress_data = JSON.stringify(stress_data);
    if (finance_data !== undefined) updateData.finance_data = JSON.stringify(finance_data);
    if (hobbies_data !== undefined) updateData.hobbies_data = JSON.stringify(hobbies_data);
    if (overall_data !== undefined) updateData.overall_data = JSON.stringify(overall_data);

    const savedReflection = await DatabaseService.update('weekly_reflections', reflectionId, updateData, req.userId);
    
    if (savedReflection) {
      // Parse JSON fields for response
      savedReflection.goals_data = JSON.parse(savedReflection.goals_data || '{}');
      savedReflection.habits_data = JSON.parse(savedReflection.habits_data || '{}');
      savedReflection.tasks_data = JSON.parse(savedReflection.tasks_data || '{}');
      savedReflection.stress_data = JSON.parse(savedReflection.stress_data || '{}');
      savedReflection.finance_data = JSON.parse(savedReflection.finance_data || '{}');
      savedReflection.hobbies_data = JSON.parse(savedReflection.hobbies_data || '{}');
      savedReflection.overall_data = JSON.parse(savedReflection.overall_data || '{}');
    }
    
    res.json(savedReflection);
  } catch (error) {
    console.error('Error updating reflection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete reflection
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const reflectionId = req.params.id;
    
    const existingReflection = await DatabaseService.findById('weekly_reflections', reflectionId, req.userId);
    if (!existingReflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }

    const deleted = await DatabaseService.delete('weekly_reflections', reflectionId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Reflection not found' });
    }
  } catch (error) {
    console.error('Error deleting reflection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;