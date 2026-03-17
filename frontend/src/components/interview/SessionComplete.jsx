import { Link } from 'react-router-dom'
import styles from './SessionComplete.module.css'

export default function SessionComplete({ role, answers, onRestart }) {
  const scored   = answers.filter(a => a.analysis?.score)
  const avgScore = scored.length
    ? Math.round(scored.reduce((s, a) => s + a.analysis.score, 0) / scored.length * 10) / 10
    : 0

  const getGrade = (score) => {
    if (score >= 8) return { label: 'Excellent', color: '#1E8449', bg: '#EAF4EE' }
    if (score >= 6) return { label: 'Good',      color: '#B7950B', bg: '#FEF9E7' }
    if (score >= 4) return { label: 'Fair',      color: '#E67E22', bg: '#FEF0E7' }
    return            { label: 'Needs Work',  color: '#C0392B', bg: '#FDEDEC' }
  }

  const grade = getGrade(avgScore)

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.scoreWrap} style={{ background: grade.bg }}>
            <span className={styles.scoreNum} style={{ color: grade.color }}>{avgScore}</span>
            <span className={styles.scoreLabel} style={{ color: grade.color }}>/10</span>
          </div>
          <div>
            <div className={styles.grade} style={{ color: grade.color }}>{grade.label}</div>
            <h2 className={styles.title}>Interview Complete!</h2>
            <p className={styles.sub}>Role: <strong>{role}</strong></p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{answers.length}</span>
            <span className={styles.statLabel}>Questions Answered</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{scored.filter(a => a.analysis.score >= 7).length}</span>
            <span className={styles.statLabel}>Strong Answers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{scored.filter(a => a.analysis.score < 5).length}</span>
            <span className={styles.statLabel}>Need Practice</span>
          </div>
        </div>

        {/* Per-question summary */}
        <div className={styles.breakdown}>
          <h3 className={styles.breakdownTitle}>Question Breakdown</h3>
          {answers.map((a, i) => {
            const g = getGrade(a.analysis?.score || 0)
            return (
              <div key={i} className={styles.row}>
                <span className={styles.rowNum}>Q{i + 1}</span>
                <span className={styles.rowQ}>{a.question}</span>
                {a.analysis && (
                  <span className={styles.rowScore} style={{ background: g.bg, color: g.color }}>
                    {a.analysis.score}/10
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onRestart}>
            Practice Again →
          </button>
          <Link to="/" className={styles.btnGhost}>Back to Home</Link>
        </div>

        <p className={styles.saved}>
          {scored.length > 0
            ? '✅ Session saved to your history (if logged in)'
            : ''}
        </p>
      </div>
    </div>
  )
}
