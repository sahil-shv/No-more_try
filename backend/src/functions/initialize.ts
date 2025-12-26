import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { initializeDatabase } from '../shared/database';

// Initialize database and containers
async function initialize(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    context.log('Initializing database...');
    await initializeDatabase();
    
    return { 
      jsonBody: { 
        message: 'Database initialized successfully',
        timestamp: new Date().toISOString()
      } 
    };
  } catch (error) {
    context.error('Database initialization failed:', error);
    return { 
      status: 500, 
      jsonBody: { 
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      } 
    };
  }
}

// Health check endpoint
async function healthCheck(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return {
    jsonBody: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

// Register HTTP functions
app.http('initialize', {
  methods: ['POST'],
  authLevel: 'function', // Requires function key for security
  route: 'admin/initialize',
  handler: initialize
});

app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: healthCheck
});