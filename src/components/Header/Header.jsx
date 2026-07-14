import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../firebase/auth';
import AuthModal from '../AuthModal/AuthModal';
import styles from './Header.module.css';

export default function Header() {
  const { currentUser, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  const linkClass = ({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoAccent}>Therapy</span>
          <span className={styles.logoRest}>View</span>
        </NavLink>

        <div className={styles.links}>
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/psychologists" className={linkClass}>
            Psychologists
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className={linkClass}>
              Favorites
            </NavLink>
          )}
        </div>

        <div className={styles.authArea}>
          {isAuthenticated ? (
            <>
              <div className={styles.user}>
                <span className={styles.userIcon} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className={styles.userName}>
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
              <button type="button" onClick={logoutUser} className={styles.outlineButton}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={styles.outlineButton}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={styles.fillButton}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={Boolean(authMode)}
        initialMode={authMode || 'login'}
        onClose={() => setAuthMode(null)}
      />
    </header>
  );
}
