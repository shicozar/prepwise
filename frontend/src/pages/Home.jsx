import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const roles = [
  'Java Backend Developer',
  'React Frontend Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'ML Engineer',
]

const steps = [
  { num: '01', color: 'var(--blush)', label: 'Choose Role', desc: 'Tell us the role you\'re targeting and we\'ll tailor everything to it.' },
  { num: '02', color: 'var(--sage)', label: 'Get Questions', desc: 'AI generates real interview questions pulled from actual job postings.' },
  { num: '03', color: 'var(--sky)', label: 'Answer Aloud', desc: 'Speak your answers. We transcribe and record every word.' },
  { num: '04', color: 'var(--lavender)', label: 'Get Coached', desc: 'Receive detailed AI feedback with specific improvements.' },
]

export default function Home() {
  return (
    <main className={styles.main}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>AI-Powered Interview Coach</div>

        <h1 className={styles.heroTitle}>
          Practice interviews<br />
          <em>like a pro</em>
        </h1>

        <p className={styles.heroSub}>
          Real questions. Real feedback. Land the role you deserve.
        </p>

        <div className={styles.heroCtas}>
          <Link to="/interview" className={styles.btnPrimary}>Begin Practice →</Link>
          <a href="#how" className={styles.btnGhost}>See how it works</a>
        </div>

        {/* Floating role pills */}
        <div className={styles.pills}>
          {roles.map((r, i) => (
            <span key={r} className={styles.pill} style={{ animationDelay: `${i * 0.15}s` }}>{r}</span>
          ))}
        </div>
      </section>

      {/* Decorative blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      {/* Stats strip */}
      <section className={styles.stats}>
        {[
          { n: '500+', l: 'Role Templates' },
          { n: '10k+', l: 'Questions Generated' },
          { n: '98%', l: 'Satisfaction Rate' },
          { n: '3×', l: 'Interview Success' },
        ].map(s => (
          <div key={s.l} className={styles.stat}>
            <span className={styles.statNum}>{s.n}</span>
            <span className={styles.statLabel}>{s.l}</span>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className={styles.how} id="how">
        <div className={styles.howHeader}>
          <div className={styles.sectionTag}>Process</div>
          <h2 className={styles.sectionTitle}>Four steps to<br /><em>interview confidence</em></h2>
        </div>

        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum} style={{ background: s.color }}>{s.num}</div>
              <h3 className={styles.stepLabel}>{s.label}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <h2 className={styles.bannerTitle}>Ready to ace your next interview?</h2>
          <Link to="/interview" className={styles.btnPrimary}>Start for free →</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 PrepWise · Built with ♥ and AI</p>
      </footer>
    </main>
  )
}
