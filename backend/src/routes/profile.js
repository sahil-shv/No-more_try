const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const profile = await DatabaseService.findById('users', req.userId, req.userId);
    
    if (!profile) {
      // Return default profile structure for new users
      return res.json({
        user_id: req.userId,
        email: '',
        name: '',
        degree: '',
        year: '',
        subjects: [],
        energy_preference: 'morning',
        career_interests: [],
        financial_stress_level: 1,
        hobbies: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/', [
  requireAuth,
  body('degree').notEmpty().withMessage('Degree is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('subjects').isArray().withMessage('Subjects must be an array'),
  body('energy_preference').isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid energy preference'),
  body('financial_stress_level').isInt({ min: 1, max: 5 }).withMessage('Financial stress level must be between 1 and 5'),
  body('career_interests').isArray().withMessage('Career interests must be an array'),
  body('hobbies').isArray().withMessage('Hobbies must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      name,
      degree,
      year,
      subjects,
      energy_preference,
      career_interests,
      financial_stress_level,
      hobbies
    } = req.body;

    // Prepare profile object
    const profileData = {
      user_id: req.userId,
      email: email || '',
      name: name || '',
      degree,
      year,
      subjects: JSON.stringify(subjects || []),
      energy_preference: energy_preference || 'morning',
      career_interests: JSON.stringify(career_interests || []),
      financial_stress_level: Math.max(1, Math.min(5, financial_stress_level || 1)),
      hobbies: JSON.stringify(hobbies || [])
    };

    // Check if profile exists
    const existingProfile = await DatabaseService.findById('users', req.userId, req.userId);
    
    let savedProfile;
    if (existingProfile) {
      // Update existing profile
      savedProfile = await DatabaseService.update('users', req.userId, profileData, req.userId);
    } else {
      // Create new profile
      savedProfile = await DatabaseService.create('users', profileData);
    }

    // Parse JSON fields for response
    if (savedProfile) {
      savedProfile.subjects = JSON.parse(savedProfile.subjects || '[]');
      savedProfile.career_interests = JSON.parse(savedProfile.career_interests || '[]');
      savedProfile.hobbies = JSON.parse(savedProfile.hobbies || '[]');
    }

    res.json(savedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;