import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.logoText}>PrepWise</span>
        </Link>

        <div className={styles.links}>
          <Link to="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>Home</Link>
          <Link to="/interview" className={`${styles.link} ${pathname === '/interview' ? styles.active : ''}`}>Practice</Link>
        </div>

        <Link to="/interview" className={styles.cta}>
          Start Session
        </Link>
      </div>
    </nav>
  )
}
