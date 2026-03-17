import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg

const pool = process.env.PG_HOST ? new Pool({
  host:     process.env.PG_HOST,
  port:     process.env.PG_PORT || 5432,
  database: process.env.PG_DB,
  user:     process.env.PG_USER,
  password: process.env.PG_PASSWORD,
}) : null

if (pool) {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('❌ PostgreSQL connection error:', err.message)
    } else {
      console.log('✅ PostgreSQL connected')
      release()
    }
  })
} else {
  console.log('⚠️  PostgreSQL not configured — using MongoDB for auth')
}

export default pool