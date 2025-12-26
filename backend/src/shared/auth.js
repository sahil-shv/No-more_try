const jwt = require('jsonwebtoken');

// Simple JWT-based authentication for Render deployment
// In production, you'd integrate with Auth0 or similar service

// Extract user ID from JWT token
function getUserIdFromRequest(req) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // For development, accept mock token
    if (token === 'mock-token' && process.env.NODE_ENV !== 'production') {
      return 'mock-user-id';
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return decoded.sub || decoded.userId || decoded.id;
  } catch (error) {
    console.error('Error extracting user ID:', error.message);
    return null;
  }
}

// Middleware to ensure user is authenticated
function requireAuth(req, res, next) {
  const userId = getUserIdFromRequest(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  req.userId = userId;
  next();
}

// Generate JWT token (for development/testing)
function generateToken(userId, email, name) {
  return jwt.sign(
    { 
      sub: userId,
      userId,
      email,
      name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    process.env.JWT_SECRET || 'fallback-secret'
  );
}

// Get user profile from token claims
function getUserProfileFromRequest(req) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return null;

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7);
    
    if (token === 'mock-token') {
      return {
        userId: 'mock-user-id',
        email: 'user@example.com',
        name: 'Test User'
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return {
      userId: decoded.sub || decoded.userId,
      email: decoded.email,
      name: decoded.name
    };
  } catch (error) {
    return null;
  }
}

// Validate token without requiring authentication (for optional auth endpoints)
function optionalAuth(req, res, next) {
  const userId = getUserIdFromRequest(req);
  req.userId = userId; // Will be null if not authenticated
  next();
}

module.exports = {
  getUserIdFromRequest,
  requireAuth,
  generateToken,
  getUserProfileFromRequest,
  optionalAuth
};