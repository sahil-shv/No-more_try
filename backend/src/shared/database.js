const { Pool } = require('pg');

// PostgreSQL configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        degree VARCHAR(255),
        year VARCHAR(100),
        subjects JSONB DEFAULT '[]',
        energy_preference VARCHAR(50) DEFAULT 'morning',
        career_interests JSONB DEFAULT '[]',
        financial_stress_level INTEGER DEFAULT 1,
        hobbies JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Goals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        goal_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Habits table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        habit_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        frequency VARCHAR(50) DEFAULT 'daily',
        completed_dates JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        task_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        linked_goal_id VARCHAR(255),
        linked_habit_id VARCHAR(255),
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Stress logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stress_logs (
        id SERIAL PRIMARY KEY,
        log_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
        fatigue INTEGER NOT NULL CHECK (fatigue >= 1 AND fatigue <= 5),
        study_duration DECIMAL(4,2) DEFAULT 0,
        stress_factors JSONB DEFAULT '[]',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Focus sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Expenses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        expense_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description VARCHAR(500) NOT NULL,
        expense_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Hobby posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hobby_posts (
        id SERIAL PRIMARY KEY,
        post_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'text',
        file_url VARCHAR(1000),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Weekly reflections table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS weekly_reflections (
        id SERIAL PRIMARY KEY,
        reflection_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        week_start_date DATE NOT NULL,
        goals_data JSONB DEFAULT '{}',
        habits_data JSONB DEFAULT '{}',
        tasks_data JSONB DEFAULT '{}',
        stress_data JSONB DEFAULT '{}',
        finance_data JSONB DEFAULT '{}',
        hobbies_data JSONB DEFAULT '{}',
        overall_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Career tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS career_tasks (
        id SERIAL PRIMARY KEY,
        task_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        estimated_time INTEGER DEFAULT 30,
        completed BOOLEAN DEFAULT FALSE,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
      CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
      CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_stress_logs_user_id ON stress_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
      CREATE INDEX IF NOT EXISTS idx_hobby_posts_created_at ON hobby_posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_weekly_reflections_user_id ON weekly_reflections(user_id);
      CREATE INDEX IF NOT EXISTS idx_career_tasks_user_id ON career_tasks(user_id);
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Generic database service
class DatabaseService {
  static async query(text, params) {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query(query, values);
    return result[0];
  }

  static async findByUserId(table, userId) {
    const query = `SELECT * FROM ${table} WHERE user_id = $1 ORDER BY created_at DESC`;
    return await this.query(query, [userId]);
  }

  static async findById(table, id, userId) {
    const idColumn = table === 'users' ? 'user_id' : `${table.slice(0, -1)}_id`;
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = $1 AND user_id = $2`;
    const result = await this.query(query, [id, userId]);
    return result[0];
  }

  static async findByUserIdAndDate(table, userId, date) {
    const query = `SELECT * FROM ${table} WHERE user_id = $1 AND date = $2`;
    const result = await this.query(query, [userId, date]);
    return result[0];
  }

  static async update(table, id, data, userId) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    
    const idColumn = table === 'users' ? 'user_id' : `${table.slice(0, -1)}_id`;
    const query = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE ${idColumn} = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING *`;
    const result = await this.query(query, [...values, id, userId]);
    return result[0];
  }

  static async delete(table, id, userId) {
    const idColumn = table === 'users' ? 'user_id' : `${table.slice(0, -1)}_id`;
    const query = `DELETE FROM ${table} WHERE ${idColumn} = $1 AND user_id = $2`;
    const result = await this.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  static async findRecentPosts(limit = 20) {
    const query = `SELECT * FROM hobby_posts ORDER BY created_at DESC LIMIT $1`;
    return await this.query(query, [limit]);
  }
}

// Test database connection
pool.on('connect', () => {
  console.log('🔗 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Closing database connections...');
  await pool.end();
  console.log('✅ Database connections closed');
  process.exit(0);
});

module.exports = { initializeDatabase, DatabaseService, pool };