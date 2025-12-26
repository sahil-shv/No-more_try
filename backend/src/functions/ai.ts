import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { requireAuth } from '../shared/auth';
import { AIService } from '../shared/aiService';
import { DatabaseService, CONTAINERS } from '../shared/database';

// AI Chat endpoint
async function aiChat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const { message, context: userContext } = await request.json() as any;
    
    if (!message || typeof message !== 'string') {
      return { status: 400, jsonBody: { error: 'Message is required' } };
    }

    // Get user profile for context
    let profileContext = null;
    try {
      const profile = await DatabaseService.read(CONTAINERS.USERS, authResult.userId, authResult.userId);
      if (profile) {
        profileContext = {
          degree: profile.degree,
          year: profile.year,
          subjects: profile.subjects,
          energyPreference: profile.energyPreference,
          careerInterests: profile.careerInterests
        };
      }
    } catch (error) {
      // Profile not found, continue without context
      context.warn('Could not fetch user profile for AI context');
    }

    // Generate AI response with ethical constraints
    const response = await AIService.generateResponse(message, {
      profile: profileContext,
      userContext
    });

    return { 
      jsonBody: { 
        response,
        timestamp: new Date().toISOString()
      } 
    };
  } catch (error) {
    context.error('Error in AI chat:', error);
    return { 
      status: 500, 
      jsonBody: { 
        error: 'I apologize, but I encountered an error. Please try again later.' 
      } 
    };
  }
}

// Generate daily routine
async function generateRoutine(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    // Fetch user data for routine generation
    const [profile, goals, habits, tasks] = await Promise.all([
      DatabaseService.read(CONTAINERS.USERS, authResult.userId, authResult.userId),
      DatabaseService.getUserItems(CONTAINERS.GOALS, authResult.userId),
      DatabaseService.getUserItems(CONTAINERS.HABITS, authResult.userId),
      DatabaseService.getUserItems(CONTAINERS.TASKS, authResult.userId)
    ]);

    if (!profile) {
      return { 
        status: 400, 
        jsonBody: { error: 'Please complete your profile first to generate a personalized routine.' } 
      };
    }

    // Generate routine using AI service
    const routine = await AIService.generateDailyRoutine(profile, goals, habits, tasks);

    return { 
      jsonBody: { 
        routine,
        generatedAt: new Date().toISOString()
      } 
    };
  } catch (error) {
    context.error('Error generating routine:', error);
    return { 
      status: 500, 
      jsonBody: { 
        error: 'Could not generate routine. Please try again later.' 
      } 
    };
  }
}

// Generate study guidance
async function studyGuidance(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const { subject, topic, level } = await request.json() as any;
    
    if (!subject || !topic) {
      return { status: 400, jsonBody: { error: 'Subject and topic are required' } };
    }

    const guidance = await AIService.generateStudyGuidance(
      subject, 
      topic, 
      level || 'undergraduate'
    );

    return { 
      jsonBody: { 
        guidance,
        subject,
        topic,
        level: level || 'undergraduate',
        generatedAt: new Date().toISOString()
      } 
    };
  } catch (error) {
    context.error('Error generating study guidance:', error);
    return { 
      status: 500, 
      jsonBody: { 
        error: 'Could not generate study guidance. Please try again later.' 
      } 
    };
  }
}

// Generate career tasks
async function careerTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    // Get user profile for personalized tasks
    const profile = await DatabaseService.read(CONTAINERS.USERS, authResult.userId, authResult.userId);
    
    if (!profile || !profile.degree) {
      return { 
        status: 400, 
        jsonBody: { error: 'Please complete your profile with degree and career interests first.' } 
      };
    }

    const tasks = await AIService.generateCareerTasks(
      profile.degree,
      profile.careerInterests || []
    );

    return { 
      jsonBody: { 
        tasks,
        degree: profile.degree,
        interests: profile.careerInterests,
        generatedAt: new Date().toISOString()
      } 
    };
  } catch (error) {
    context.error('Error generating career tasks:', error);
    return { 
      status: 500, 
      jsonBody: { 
        error: 'Could not generate career tasks. Please try again later.' 
      } 
    };
  }
}

// Register HTTP functions
app.http('aiChat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'ai/chat',
  handler: aiChat
});

app.http('generateRoutine', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'ai/routine',
  handler: generateRoutine
});

app.http('studyGuidance', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'ai/study',
  handler: studyGuidance
});

app.http('careerTasks', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'ai/career',
  handler: careerTasks
});