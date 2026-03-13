import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import connectMongo from './config/mongo.js'
import { initDB } from './config/initDB.js'

import authRoutes      from './routes/auth.js'
import interviewRoutes from './routes/interview.js'
import speechRoutes    from './routes/speech.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// ── Connect Databases ───────────────────────────────────
connectMongo()
initDB()

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/speech',    speechRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PrepWise API', timestamp: new Date().toISOString() })
})

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong', message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 PrepWise API running on http://localhost:${PORT}`)
})
