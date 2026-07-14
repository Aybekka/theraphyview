import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addFavorite, removeFavorite } from '../../firebase/database';
import styles from './PsychologistCard.module.css';

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className={styles.star} aria-hidden="true">
      <path
        d="M8 1.33 10.06 5.5l4.6.67-3.33 3.25.79 4.58L8 11.83 3.88 14l.79-4.58L1.34 6.17l4.6-.67L8 1.33Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function PsychologistCard({
  psychologist,
  onRequireAuth,
  onBookAppointment,
}) {
  const { currentUser, favorites, isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const isFavorite = Boolean(favorites[psychologist.id]);

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    if (isFavorite) {
      await removeFavorite(currentUser.uid, psychologist.id);
    } else {
      await addFavorite(currentUser.uid, psychologist.id);
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.avatarBox}>
        <img src={psychologist.avatar_url} alt={psychologist.name} className={styles.avatar} />
        <span className={styles.onlineDot} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.category}>Psychologist</span>
          <div className={styles.meta}>
            <span className={styles.rating}>
              <StarIcon />
              Rating: {psychologist.rating}
            </span>
            <span className={styles.divider} aria-hidden="true" />
            <span className={styles.price}>
              Price / 1 hour: <span className={styles.priceValue}>{psychologist.price_per_hour}$</span>
            </span>
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`${styles.heartButton} ${isFavorite ? styles.heartActive : ''}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 21s-6.72-4.35-9.33-8.11C.9 10.34 1.63 6.9 4.36 5.42a5.05 5.05 0 0 1 6.29 1.17L12 8l1.35-1.41a5.05 5.05 0 0 1 6.29-1.17c2.73 1.48 3.46 4.92 1.69 7.47C18.72 16.65 12 21 12 21Z"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <h3 className={styles.name}>{psychologist.name}</h3>

        <ul className={styles.chips}>
          <li className={styles.chip}>
            <span className={styles.chipLabel}>Experience:</span> {psychologist.experience}
          </li>
          {psychologist.license && (
            <li className={styles.chip}>
              <span className={styles.chipLabel}>License:</span>{' '}
              {typeof psychologist.license === 'string'
                ? psychologist.license
                : 'Licensed Psychologist'}
            </li>
          )}
          <li className={styles.chip}>
            <span className={styles.chipLabel}>Specialization:</span> {psychologist.specialization}
          </li>
          <li className={styles.chip}>
            <span className={styles.chipLabel}>Initial_consultation:</span>{' '}
            {psychologist.initial_consultation}
          </li>
        </ul>

        <p className={styles.about}>{psychologist.about}</p>

        {!expanded && (
          <button type="button" className={styles.readMore} onClick={() => setExpanded(true)}>
            Read more
          </button>
        )}

        {expanded && (
          <div className={styles.expandedSection}>
            <ul className={styles.reviews}>
              {psychologist.reviews?.map((review, index) => (
                <li key={index} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewAvatar} aria-hidden="true">
                      {review.reviewer?.charAt(0) || review.author?.charAt(0)}
                    </span>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewName}>{review.reviewer || review.author}</span>
                      {review.rating != null && (
                        <span className={styles.reviewRating}>
                          <StarIcon />
                          {Number(review.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.reviewText}>{review.comment || review.text}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.appointmentButton}
              onClick={() => onBookAppointment(psychologist)}
            >
              Make an appointment
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
