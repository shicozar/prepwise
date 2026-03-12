import styles from './Results.module.css'

export default function Results() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.tag}>Coming Day 3</div>
        <h1 className={styles.title}>Your interview<br /><em>results will live here</em></h1>
        <p className={styles.sub}>AI-powered analysis, transcripts, and coaching tips.</p>
      </div>
    </main>
  )
}
