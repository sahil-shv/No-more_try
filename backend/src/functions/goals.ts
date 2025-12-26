import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService, CONTAINERS } from '../shared/database';
import { requireAuth } from '../shared/auth';

interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'academic' | 'career' | 'personal';
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Get user goals
async function getGoals(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const goals = await DatabaseService.getUserItems(CONTAINERS.GOALS, authResult.userId);
    return { jsonBody: goals };
  } catch (error) {
    context.error('Error fetching goals:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Create new goal
async function createGoal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const goalData = await request.json() as any;
    
    // Validate required fields
    if (!goalData.title || !goalData.category) {
      return { status: 400, jsonBody: { error: 'Title and category are required' } };
    }

    // Check active goals limit (prevent overload)
    const existingGoals = await DatabaseService.getUserItems(CONTAINERS.GOALS, authResult.userId);
    const activeGoals = existingGoals.filter((g: Goal) => g.status === 'active');
    
    if (activeGoals.length >= 5) {
      return { 
        status: 400, 
        jsonBody: { 
          error: 'You have reached the maximum number of active goals (5). Consider completing or pausing some goals first.' 
        } 
      };
    }

    // Create goal object
    const goal: Goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: authResult.userId,
      title: goalData.title.trim(),
      description: goalData.description?.trim() || '',
      category: goalData.category,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedGoal = await DatabaseService.create(CONTAINERS.GOALS, goal);
    return { status: 201, jsonBody: savedGoal };
  } catch (error) {
    context.error('Error creating goal:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Update goal
async function updateGoal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const goalId = request.params.id;
    if (!goalId) {
      return { status: 400, jsonBody: { error: 'Goal ID is required' } };
    }

    const goalData = await request.json() as any;
    
    // Get existing goal
    const existingGoal = await DatabaseService.read(CONTAINERS.GOALS, goalId, authResult.userId);
    if (!existingGoal) {
      return { status: 404, jsonBody: { error: 'Goal not found' } };
    }

    // Update goal object
    const updatedGoal = {
      ...existingGoal,
      title: goalData.title?.trim() || existingGoal.title,
      description: goalData.description?.trim() || existingGoal.description,
      category: goalData.category || existingGoal.category,
      status: goalData.status || existingGoal.status,
      updatedAt: new Date().toISOString()
    };

    const savedGoal = await DatabaseService.update(CONTAINERS.GOALS, updatedGoal);
    return { jsonBody: savedGoal };
  } catch (error) {
    context.error('Error updating goal:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Delete goal
async function deleteGoal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const goalId = request.params.id;
    if (!goalId) {
      return { status: 400, jsonBody: { error: 'Goal ID is required' } };
    }

    // Verify goal exists and belongs to user
    const existingGoal = await DatabaseService.read(CONTAINERS.GOALS, goalId, authResult.userId);
    if (!existingGoal) {
      return { status: 404, jsonBody: { error: 'Goal not found' } };
    }

    await DatabaseService.delete(CONTAINERS.GOALS, goalId, authResult.userId);
    return { status: 204 };
  } catch (error) {
    context.error('Error deleting goal:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register HTTP functions
app.http('getGoals', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'goals',
  handler: getGoals
});

app.http('createGoal', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'goals',
  handler: createGoal
});

app.http('updateGoal', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'goals/{id}',
  handler: updateGoal
});

app.http('deleteGoal', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'goals/{id}',
  handler: deleteGoal
});