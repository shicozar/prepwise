import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { interviewAPI } from '../services/api'
import styles from './Results.module.css'

const GRADE = (score) => {
  if (!score) return { label: 'No score', color: '#8A8A8E', bg: '#F4F6F9' }
  if (score >= 8) return { label: 'Excellent', color: '#1E8449', bg: '#EAF4EE' }
  if (score >= 6) return { label: 'Good',      color: '#B7950B', bg: '#FEF9E7' }
  if (score >= 4) return { label: 'Fair',      color: '#E67E22', bg: '#FEF0E7' }
  return               { label: 'Needs Work', color: '#C0392B', bg: '#FDEDEC' }
}

export default function Results() {
  const { id }    = useParams()
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [interview, setInterview] = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [expanded,  setExpanded]  = useState(null)

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    if (!id)   { navigate('/history'); return }
    interviewAPI.getOne(id)
      .then(res => setInterview(res.data.interview))
      .catch(() => setError('Could not load this interview'))
      .finally(() => setLoading(false))
  }, [id, user])

  if (loading) return (
    <main className={styles.main}>
      <div className={styles.loading}><div className={styles.spinner} /></div>
    </main>
  )

  if (error || !interview) return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Interview not found'}</div>
        <Link to="/history" className={styles.backLink}>← Back to History</Link>
      </div>
    </main>
  )

  const grade = GRADE(interview.overallScore)
  const fmt   = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Back */}
        <Link to="/history" className={styles.backLink}>← Back to History</Link>

        {/* Header card */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.tag}>Interview Review</div>
            <h1 className={styles.role}>{interview.role}</h1>
            <p className={styles.meta}>
              {fmt(interview.createdAt)} · {interview.answers?.length || 0} questions answered
            </p>
          </div>
          {interview.overallScore && (
            <div className={styles.bigScore} style={{ background: grade.bg, color: grade.color }}>
              <span className={styles.bigScoreNum}>{interview.overallScore}</span>
              <span className={styles.bigScoreOf}>/10</span>
              <span className={styles.bigScoreLabel}>{grade.label}</span>
            </div>
          )}
        </div>

        {/* Answers */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Question Breakdown</h2>

          {interview.answers?.length === 0 && (
            <p className={styles.noAnswers}>No answers recorded for this session.</p>
          )}

          <div className={styles.answerList}>
            {interview.answers?.map((answer, i) => {
              const ag = GRADE(answer.analysis?.score)
              const isOpen = expanded === i
              return (
                <div key={i} className={styles.answerCard}>
                  {/* Collapsed header */}
                  <button
                    className={styles.answerHeader}
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className={styles.answerHeaderLeft}>
                      <span className={styles.answerNum}>Q{i + 1}</span>
                      <span className={styles.answerQ}>{answer.question}</span>
                    </div>
                    <div className={styles.answerHeaderRight}>
                      {answer.analysis?.score && (
                        <span className={styles.answerScore}
                          style={{ background: ag.bg, color: ag.color }}>
                          {answer.analysis.score}/10
                        </span>
                      )}
                      <span className={styles.chevron}>{isOpen ? '↑' : '↓'}</span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && answer.analysis && (
                    <div className={styles.answerDetail}>
                      <p className={styles.summary}>{answer.analysis.summary}</p>

                      <div className={styles.feedbackGrid}>
                        <div className={styles.feedbackBox} style={{ background: '#EAF4EE' }}>
                          <div className={styles.feedbackLabel} style={{ color: '#1E8449' }}>✓ Strengths</div>
                          {answer.analysis.strengths?.map((s, j) => (
                            <div key={j} className={styles.feedbackItem}>{s}</div>
                          ))}
                        </div>
                        <div className={styles.feedbackBox} style={{ background: '#FEF9E7' }}>
                          <div className={styles.feedbackLabel} style={{ color: '#B7950B' }}>↑ Improvements</div>
                          {answer.analysis.improvements?.map((imp, j) => (
                            <div key={j} className={styles.feedbackItem}>{imp}</div>
                          ))}
                        </div>
                      </div>

                      {answer.analysis.keywords?.length > 0 && (
                        <div className={styles.keywords}>
                          <span className={styles.keywordsLabel}>Key terms:</span>
                          {answer.analysis.keywords.map(k => (
                            <span key={k} className={styles.keyword}>{k}</span>
                          ))}
                        </div>
                      )}

                      <details className={styles.details}>
                        <summary>Model answer</summary>
                        <p>{answer.analysis.suggestedAnswer}</p>
                      </details>

                      {answer.transcript && (
                        <details className={styles.details}>
                          <summary>Your answer</summary>
                          <p>{answer.transcript}</p>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/interview" className={styles.btnPrimary}>Practice This Role Again →</Link>
          <Link to="/history"   className={styles.btnGhost}>← All Sessions</Link>
        </div>

      </div>
    </main>
  )
}
