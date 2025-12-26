import { HttpRequest } from '@azure/functions';

// Extract user ID from Azure AD B2C token
export function getUserIdFromRequest(req: HttpRequest): string | null {
  try {
    // In a real implementation, you would validate the JWT token
    // For now, we'll extract from a simple header or use a mock
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    // TODO: Implement proper JWT validation with Azure AD B2C
    // This is a simplified version for development
    const token = authHeader.substring(7);
    
    // For development, we'll use a simple approach
    // In production, decode and validate the JWT properly
    if (token === 'mock-token') {
      return 'mock-user-id';
    }

    // Extract user ID from token (simplified)
    // In real implementation, use a JWT library to decode and validate
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.sub || payload.oid; // Azure AD B2C user identifier
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Error extracting user ID:', error);
    return null;
  }
}

// Middleware to ensure user is authenticated
export function requireAuth(req: HttpRequest): { userId: string } | { error: string } {
  const userId = getUserIdFromRequest(req);
  
  if (!userId) {
    return { error: 'Authentication required' };
  }
  
  return { userId };
}

// Generate a simple user profile from token claims
export function getUserProfileFromRequest(req: HttpRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return null;

  // TODO: Extract additional claims from JWT token
  // For now, return basic info
  return {
    userId,
    email: 'user@example.com', // Extract from token
    name: 'Student User' // Extract from token
  };
}