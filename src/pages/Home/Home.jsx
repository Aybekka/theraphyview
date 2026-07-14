import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.jpg';
import styles from './Home.module.css';

export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          The road to the <span className={styles.accent}>depths</span> of the human soul
        </h1>
        <p className={styles.tagline}>
          We help you to reveal your potential, overcome challenges and find a guide in your own
          life with the help of our experienced psychologists.
        </p>
        <Link to="/psychologists" className={styles.cta}>
          Get started
          <svg width="15" height="17" viewBox="0 0 15 17" fill="none" aria-hidden="true">
            <path
              d="M13.4 3.02 1.72 15.02M13.4 3.02l.44 10.46M13.4 3.02 2.98 1.9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      <div className={styles.visual}>
        <img
          src={heroImage}
          alt="Psychologist during a therapy session"
          className={styles.image}
        />
        <span className={`${styles.badge} ${styles.badgeQuestion}`} aria-hidden="true">
          ?
        </span>
        <span className={`${styles.badge} ${styles.badgeUsers}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <div className={styles.statCard}>
          <span className={styles.statIcon} aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.6 9.2 18 20 6.6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Experienced psychologists</span>
            <span className={styles.statValue}>15,000</span>
          </div>
        </div>
      </div>
    </section>
  );
}
