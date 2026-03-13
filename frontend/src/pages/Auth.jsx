import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Auth() {
  const [tab, setTab]         = useState('login')   // 'login' | 'signup'
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.card}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.logoText}>PrepWise</span>
        </Link>

        <p className={styles.tagline}>
          {tab === 'login' ? 'Welcome back 👋' : 'Create your account'}
        </p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`} onClick={() => setTab('login')}>
            Sign In
          </button>
          <button className={`${styles.tab} ${tab === 'signup' ? styles.active : ''}`} onClick={() => setTab('signup')}>
            Sign Up
          </button>
        </div>

        {/* Fields */}
        <div className={styles.fields}>
          {tab === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Aryan Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.btn}
          onClick={handleSubmit}
          disabled={loading || !email || !password || (tab === 'signup' && !name)}
        >
          {loading ? 'Please wait...' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        <p className={styles.guest}>
          Just browsing?{' '}
          <Link to="/interview" className={styles.guestLink}>Continue as guest</Link>
          {' '}(progress won't be saved)
        </p>
      </div>
    </main>
  )
}
