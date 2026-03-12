import { useState } from 'react'
import styles from './Interview.module.css'

export default function Interview() {
  const [role, setRole] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {!submitted ? (
          <div className={styles.setupCard}>
            <div className={styles.cardTag}>Step 1 of 4</div>
            <h1 className={styles.title}>What role are you<br /><em>interviewing for?</em></h1>
            <p className={styles.sub}>We'll generate tailored questions from real job postings.</p>

            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Java Backend Developer"
                value={role}
                onChange={e => setRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && role.trim() && setSubmitted(true)}
              />
              <button
                className={styles.btn}
                disabled={!role.trim()}
                onClick={() => setSubmitted(true)}
              >
                Generate Questions →
              </button>
            </div>

            <div className={styles.suggestions}>
              {['Java Backend Developer', 'React Frontend Engineer', 'DevOps Engineer', 'Data Scientist'].map(r => (
                <button key={r} className={styles.chip} onClick={() => setRole(r)}>{r}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.comingSoon}>
            <h2>🎉 Role set: <em>{role}</em></h2>
            <p>Question generation coming on Day 2!</p>
            <button className={styles.btn} onClick={() => setSubmitted(false)}>← Change Role</button>
          </div>
        )}
      </div>
    </main>
  )
}
