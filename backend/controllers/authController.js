import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/postgres.js'
import User from '../models/User.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const usePostgres = () => !!pool

// ── POST /api/auth/signup ────────────────────────────────
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const hashed = await bcrypt.hash(password, 12)

    if (usePostgres()) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
      if (existing.rows.length > 0)
        return res.status(409).json({ error: 'Email already registered' })
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashed]
      )
      const user = result.rows[0]
      return res.status(201).json({ success: true, token: generateToken(user), user: { id: user.id, name: user.name, email: user.email } })
    } else {
      const existing = await User.findOne({ email })
      if (existing)
        return res.status(409).json({ error: 'Email already registered' })
      const user = await User.create({ name, email, password: hashed })
      return res.status(201).json({ success: true, token: generateToken(user), user: { id: user._id, name: user.name, email: user.email } })
    }
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

    let user
    if (usePostgres()) {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      if (result.rows.length === 0)
        return res.status(401).json({ error: 'Invalid email or password' })
      user = result.rows[0]
      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(401).json({ error: 'Invalid email or password' })
      return res.json({ success: true, token: generateToken(user), user: { id: user.id, name: user.name, email: user.email } })
    } else {
      user = await User.findOne({ email })
      if (!user) return res.status(401).json({ error: 'Invalid email or password' })
      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(401).json({ error: 'Invalid email or password' })
      return res.json({ success: true, token: generateToken(user), user: { id: user._id, name: user.name, email: user.email } })
    }
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Login failed', message: err.message })
  }
}

// ── GET /api/auth/me ─────────────────────────────────────
export async function getMe(req, res) {
  try {
    if (usePostgres()) {
      const result = await pool.query(
        'SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })
      return res.json({ success: true, user: result.rows[0] })
    } else {
      const user = await User.findById(req.user.id).select('-password')
      if (!user) return res.status(404).json({ error: 'User not found' })
      return res.json({ success: true, user })
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}