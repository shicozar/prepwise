import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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

        <div className={styles.right}>
          {user ? (
            <>
              <span className={styles.userName}>👋 {user.name.split(' ')[0]}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <Link to="/auth" className={styles.cta}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
