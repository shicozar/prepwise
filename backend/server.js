import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import interviewRoutes from './routes/interview.js'
import speechRoutes from './routes/speech.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

// ── Routes ──────────────────────────────────────────────
app.use('/api/interview', interviewRoutes)
app.use('/api/speech', speechRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PrepWise API', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong', message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 PrepWise API running on http://localhost:${PORT}`)
})
