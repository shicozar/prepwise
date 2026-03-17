import { useState } from 'react'
import styles from './RoleSetup.module.css'

const SUGGESTIONS = [
  'Java Backend Developer',
  'React Frontend Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'ML Engineer',
  'iOS Developer',
  'Full Stack Developer',
]

export default function RoleSetup({ onStart, loading }) {
  const [role, setRole] = useState('')
  const [count, setCount] = useState(5)

  return (
    <div className={styles.card}>
      <div className={styles.tag}>Step 1 — Setup</div>
      <h1 className={styles.title}>
        What role are you<br /><em>interviewing for?</em>
      </h1>
      <p className={styles.sub}>
        AI will generate real questions based on actual job postings for this role.
      </p>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Java Backend Developer"
          value={role}
          onChange={e => setRole(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && role.trim() && onStart(role, count)}
        />
      </div>

      <div className={styles.countRow}>
        <span className={styles.countLabel}>Number of questions:</span>
        {[3, 5, 7, 10].map(n => (
          <button
            key={n}
            className={`${styles.countBtn} ${count === n ? styles.active : ''}`}
            onClick={() => setCount(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map(s => (
          <button key={s} className={styles.chip} onClick={() => setRole(s)}>
            {s}
          </button>
        ))}
      </div>

      <button
        className={styles.btn}
        disabled={!role.trim() || loading}
        onClick={() => onStart(role.trim(), count)}
      >
        {loading ? (
          <span className={styles.loadingRow}>
            <span className={styles.spinner} /> Generating questions…
          </span>
        ) : 'Generate Interview Questions →'}
      </button>
    </div>
  )
}
