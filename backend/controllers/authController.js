import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/postgres.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

// ── POST /api/auth/signup ────────────────────────────────
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' })

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 12)

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashed]
    )

    const user = result.rows[0]
    const token = generateToken(user)

    res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('signup error:', err)
    res.status(500).json({ error: 'Signup failed', message: err.message })
  }
}

// ── POST /api/auth/login ─────────────────────────────────
export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' })

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password)

    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' })

    const token = generateToken(user)

    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Login failed', message: err.message })
  }
}

// ── GET /api/auth/me ─────────────────────────────────────
export async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' })

    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}
