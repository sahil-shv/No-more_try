import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService, CONTAINERS } from '../shared/database';
import { requireAuth } from '../shared/auth';

// Get user profile
async function getProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const profile = await DatabaseService.read(CONTAINERS.USERS, authResult.userId, authResult.userId);
    
    if (!profile) {
      // Return default profile structure for new users
      return {
        jsonBody: {
          id: authResult.userId,
          userId: authResult.userId,
          degree: '',
          year: '',
          subjects: [],
          energyPreference: 'morning',
          careerInterests: [],
          financialStressLevel: 1,
          hobbies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }

    return { jsonBody: profile };
  } catch (error) {
    context.error('Error fetching profile:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Update user profile
async function updateProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authResult = requireAuth(request);
  if ('error' in authResult) {
    return { status: 401, jsonBody: { error: authResult.error } };
  }

  try {
    const profileData = await request.json() as any;
    
    // Validate required fields
    if (!profileData.degree || !profileData.year) {
      return { status: 400, jsonBody: { error: 'Degree and year are required' } };
    }

    // Prepare profile object
    const profile = {
      id: authResult.userId,
      userId: authResult.userId,
      degree: profileData.degree,
      year: profileData.year,
      subjects: profileData.subjects || [],
      energyPreference: profileData.energyPreference || 'morning',
      careerInterests: profileData.careerInterests || [],
      financialStressLevel: Math.max(1, Math.min(5, profileData.financialStressLevel || 1)),
      hobbies: profileData.hobbies || [],
      updatedAt: new Date().toISOString()
    };

    // Check if profile exists
    const existingProfile = await DatabaseService.read(CONTAINERS.USERS, authResult.userId, authResult.userId);
    
    let savedProfile;
    if (existingProfile) {
      // Update existing profile
      profile.createdAt = existingProfile.createdAt;
      savedProfile = await DatabaseService.update(CONTAINERS.USERS, profile);
    } else {
      // Create new profile
      profile.createdAt = new Date().toISOString();
      savedProfile = await DatabaseService.create(CONTAINERS.USERS, profile);
    }

    return { jsonBody: savedProfile };
  } catch (error) {
    context.error('Error updating profile:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register HTTP functions
app.http('getProfile', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'profile',
  handler: getProfile
});

app.http('updateProfile', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'profile',
  handler: updateProfile
});