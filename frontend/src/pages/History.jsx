import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { interviewAPI } from '../services/api'
import styles from './History.module.css'

const GRADE = (score) => {
  if (!score) return { label: 'Incomplete', color: '#8A8A8E', bg: '#F4F6F9' }
  if (score >= 8) return { label: 'Excellent', color: '#1E8449', bg: '#EAF4EE' }
  if (score >= 6) return { label: 'Good',      color: '#B7950B', bg: '#FEF9E7' }
  if (score >= 4) return { label: 'Fair',      color: '#E67E22', bg: '#FEF0E7' }
  return               { label: 'Needs Work', color: '#C0392B', bg: '#FDEDEC' }
}

const fmt = (date) => new Date(date).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
})

export default function History() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/auth'); return }
    interviewAPI.getHistory()
      .then(res => setInterviews(res.data.interviews))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false))
  }, [user, authLoading])

  // ── Stats ──────────────────────────────────────────────
  const completed = interviews.filter(i => i.status === 'completed')
  const avgScore  = completed.length
    ? (completed.reduce((s, i) => s + (i.overallScore || 0), 0) / completed.length).toFixed(1)
    : 0
  const roles = [...new Set(interviews.map(i => i.role))]

  if (loading) return (
    <main className={styles.main}>
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading your history…</p>
      </div>
    </main>
  )

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.tag}>Your Progress</div>
            <h1 className={styles.title}>Interview <em>History</em></h1>
            <p className={styles.sub}>Track your improvement over time</p>
          </div>
          <Link to="/interview" className={styles.newBtn}>+ New Interview</Link>
        </div>

        {/* Stats strip */}
        {interviews.length > 0 && (
          <div className={styles.stats}>
            {[
              { n: interviews.length,    l: 'Total Sessions' },
              { n: completed.length,     l: 'Completed' },
              { n: avgScore,             l: 'Avg Score' },
              { n: roles.length,         l: 'Roles Practiced' },
            ].map(s => (
              <div key={s.l} className={styles.stat}>
                <span className={styles.statNum}>{s.n}</span>
                <span className={styles.statLabel}>{s.l}</span>
              </div>
            ))}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {/* Empty state */}
        {interviews.length === 0 && !loading && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎯</div>
            <h2 className={styles.emptyTitle}>No interviews yet</h2>
            <p className={styles.emptySub}>Complete your first interview to see your history here.</p>
            <Link to="/interview" className={styles.emptyBtn}>Start Practicing →</Link>
          </div>
        )}

        {/* Interview cards */}
        {interviews.length > 0 && (
          <div className={styles.grid}>
            {interviews.map(interview => {
              const grade = GRADE(interview.overallScore)
              const answeredCount = interview.answers?.length || 0
              return (
                <Link
                  key={interview._id}
                  to={`/results/${interview._id}`}
                  className={styles.card}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.roleWrap}>
                      <span className={styles.role}>{interview.role}</span>
                      <span
                        className={styles.statusBadge}
                        style={{ background: interview.status === 'completed' ? '#EAF4EE' : '#FEF9E7',
                                 color:      interview.status === 'completed' ? '#1E8449' : '#B7950B' }}
                      >
                        {interview.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                      </span>
                    </div>
                    {interview.overallScore && (
                      <div className={styles.scoreChip} style={{ background: grade.bg, color: grade.color }}>
                        {interview.overallScore}/10
                      </div>
                    )}
                  </div>

                  <div className={styles.cardMeta}>
                    <span>{fmt(interview.createdAt)}</span>
                    <span>·</span>
                    <span>{answeredCount} answer{answeredCount !== 1 ? 's' : ''}</span>
                    {interview.overallScore && (
                      <>
                        <span>·</span>
                        <span style={{ color: grade.color, fontWeight: 500 }}>{grade.label}</span>
                      </>
                    )}
                  </div>

                  {/* Mini score bar */}
                  {interview.overallScore && (
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreBarFill}
                        style={{
                          width: `${(interview.overallScore / 10) * 100}%`,
                          background: grade.color
                        }}
                      />
                    </div>
                  )}

                  <div className={styles.cardArrow}>View Details →</div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
