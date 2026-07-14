import { useEffect, useState } from 'react';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import AppointmentModal from '../../components/AppointmentModal/AppointmentModal';
import { useAuth } from '../../context/AuthContext';
import { fetchAllPsychologists } from '../../firebase/database';
import styles from '../Psychologists/Psychologists.module.css';

export default function Favorites() {
  const { favorites } = useAuth();
  const [allPsychologists, setAllPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentTarget, setAppointmentTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchAllPsychologists()
      .then((data) => {
        if (isMounted) setAllPsychologists(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const favoriteIds = Object.keys(favorites);
  const favoritePsychologists = allPsychologists.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.srOnly}>Favorites</h1>

        {error && <p className={styles.errorText}>Couldn&apos;t load favorites: {error}</p>}

        {!loading && favoritePsychologists.length === 0 && !error && (
          <p className={styles.emptyText}>You haven&apos;t added any favorites yet.</p>
        )}

        <div className={styles.grid}>
          {loading &&
            [0, 1].map((n) => (
              <div key={n} className={styles.skeleton} aria-hidden="true">
                <div className={styles.skeletonAvatar} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                </div>
              </div>
            ))}
          {favoritePsychologists.map((psychologist) => (
            <PsychologistCard
              key={psychologist.id}
              psychologist={psychologist}
              onRequireAuth={() => {}}
              onBookAppointment={setAppointmentTarget}
            />
          ))}
        </div>
      </div>

      <AppointmentModal
        isOpen={Boolean(appointmentTarget)}
        onClose={() => setAppointmentTarget(null)}
        psychologist={appointmentTarget}
      />
    </div>
  );
}
