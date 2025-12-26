const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../shared/auth');
const { AIService } = require('../shared/aiService');
const { DatabaseService } = require('../shared/database');

const router = express.Router();

// AI Chat endpoint
router.post('/chat', [
  requireAuth,
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context } = req.body;
    
    // Get user profile for context
    let profileContext = null;
    try {
      const profile = await DatabaseService.findById('users', req.userId, req.userId);
      if (profile) {
        profileContext = {
          degree: profile.degree,
          year: profile.year,
          subjects: JSON.parse(profile.subjects || '[]'),
          energy_preference: profile.energy_preference,
          career_interests: JSON.parse(profile.career_interests || '[]')
        };
      }
    } catch (error) {
      console.warn('Could not fetch user profile for AI context');
    }

    // Generate AI response with ethical constraints
    const response = await AIService.generateResponse(message, {
      profile: profileContext,
      userContext: context
    });

    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ 
      error: 'I apologize, but I encountered an error. Please try again later.' 
    });
  }
});

// Generate daily routine
router.post('/routine', requireAuth, async (req, res) => {
  try {
    // Fetch user data for routine generation
    const [profile, goals, habits, tasks] = await Promise.all([
      DatabaseService.findById('users', req.userId, req.userId),
      DatabaseService.findByUserId('goals', req.userId),
      DatabaseService.findByUserId('habits', req.userId),
      DatabaseService.findByUserId('tasks', req.userId)
    ]);

    if (!profile) {
      return res.status(400).json({ 
        error: 'Please complete your profile first to generate a personalized routine.' 
      });
    }

    // Parse JSON fields
    const profileData = {
      ...profile,
      subjects: JSON.parse(profile.subjects || '[]'),
      career_interests: JSON.parse(profile.career_interests || '[]'),
      hobbies: JSON.parse(profile.hobbies || '[]')
    };

    // Generate routine using AI service
    const routine = await AIService.generateDailyRoutine(profileData, goals, habits, tasks);

    res.json({ 
      routine,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating routine:', error);
    res.status(500).json({ 
      error: 'Could not generate routine. Please try again later.' 
    });
  }
});

// Generate study guidance
router.post('/study', [
  requireAuth,
  body('subject').notEmpty().withMessage('Subject is required'),
  body('topic').notEmpty().withMessage('Topic is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, topic, level } = req.body;
    
    const guidance = await AIService.generateStudyGuidance(
      subject, 
      topic, 
      level || 'undergraduate'
    );

    res.json({ 
      guidance,
      subject,
      topic,
      level: level || 'undergraduate',
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating study guidance:', error);
    res.status(500).json({ 
      error: 'Could not generate study guidance. Please try again later.' 
    });
  }
});

// Generate career tasks
router.post('/career', requireAuth, async (req, res) => {
  try {
    // Get user profile for personalized tasks
    const profile = await DatabaseService.findById('users', req.userId, req.userId);
    
    if (!profile || !profile.degree) {
      return res.status(400).json({ 
        error: 'Please complete your profile with degree and career interests first.' 
      });
    }

    const careerInterests = JSON.parse(profile.career_interests || '[]');
    const tasks = await AIService.generateCareerTasks(profile.degree, careerInterests);

    res.json({ 
      tasks,
      degree: profile.degree,
      interests: careerInterests,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating career tasks:', error);
    res.status(500).json({ 
      error: 'Could not generate career tasks. Please try again later.' 
    });
  }
});

// Generate wellness suggestions
router.post('/wellness', [
  requireAuth,
  body('stressLevel').isInt({ min: 1, max: 5 }).withMessage('Stress level must be between 1 and 5'),
  body('stressFactors').isArray().withMessage('Stress factors must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { stressLevel, stressFactors } = req.body;
    
    const suggestions = await AIService.generateWellnessSuggestions(stressLevel, stressFactors);

    res.json({ 
      suggestions,
      stressLevel,
      stressFactors,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating wellness suggestions:', error);
    res.status(500).json({ 
      error: 'Could not generate wellness suggestions. Please try again later.' 
    });
  }
});

module.exports = router;