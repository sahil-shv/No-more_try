import { CosmosClient, Database, Container } from '@azure/cosmos';

// Database configuration
const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseName = process.env.COSMOS_DB_DATABASE_NAME || 'nomore';

// Initialize Cosmos client
const client = new CosmosClient({ endpoint, key });

// Database and container references
let database: Database;
let containers: { [key: string]: Container } = {};

// Container names
export const CONTAINERS = {
  USERS: 'users',
  GOALS: 'goals',
  HABITS: 'habits',
  TASKS: 'tasks',
  STRESS_LOGS: 'stress_logs',
  FOCUS_SESSIONS: 'focus_sessions',
  REFLECTIONS: 'reflections',
  HOBBIES: 'hobbies',
  EXPENSES: 'expenses'
};

// Initialize database and containers
export async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const { database: db } = await client.databases.createIfNotExists({
      id: databaseName
    });
    database = db;

    // Create containers if they don't exist
    for (const containerName of Object.values(CONTAINERS)) {
      const { container } = await database.containers.createIfNotExists({
        id: containerName,
        partitionKey: '/userId' // All containers partitioned by userId
      });
      containers[containerName] = container;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Get container by name
export function getContainer(containerName: string): Container {
  if (!containers[containerName]) {
    throw new Error(`Container ${containerName} not initialized`);
  }
  return containers[containerName];
}

// Generic CRUD operations
export class DatabaseService {
  static async create(containerName: string, item: any) {
    const container = getContainer(containerName);
    const { resource } = await container.items.create(item);
    return resource;
  }

  static async read(containerName: string, id: string, userId: string) {
    const container = getContainer(containerName);
    try {
      const { resource } = await container.item(id, userId).read();
      return resource;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      throw error;
    }
  }

  static async update(containerName: string, item: any) {
    const container = getContainer(containerName);
    const { resource } = await container.item(item.id, item.userId).replace(item);
    return resource;
  }

  static async delete(containerName: string, id: string, userId: string) {
    const container = getContainer(containerName);
    await container.item(id, userId).delete();
  }

  static async query(containerName: string, querySpec: any) {
    const container = getContainer(containerName);
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  static async getUserItems(containerName: string, userId: string) {
    return this.query(containerName, {
      query: 'SELECT * FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: userId }]
    });
  }
}