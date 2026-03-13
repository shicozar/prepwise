import pool from '../config/postgres.js'

export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(255) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token       VARCHAR(512) UNIQUE NOT NULL,
        expires_at  TIMESTAMP NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ PostgreSQL tables ready')
  } catch (err) {
    console.error('❌ DB init error:', err.message)
  }
}
