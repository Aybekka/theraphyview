import { useState } from 'react';
import SortControl from '../../components/SortControl/SortControl';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import AppointmentModal from '../../components/AppointmentModal/AppointmentModal';
import AuthModal from '../../components/AuthModal/AuthModal';
import AuthPromptModal from '../../components/AuthPromptModal/AuthPromptModal';
import { usePsychologists } from '../../hooks/usePsychologists';
import styles from './Psychologists.module.css';

export default function Psychologists() {
  const [sortValue, setSortValue] = useState('name-asc');
  const { items, loading, error, hasMore, loadMore } = usePsychologists(sortValue);

  const [appointmentTarget, setAppointmentTarget] = useState(null);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.srOnly}>Psychologists</h1>

        <div className={styles.filters}>
          <SortControl value={sortValue} onChange={setSortValue} />
        </div>

        {error && <p className={styles.errorText}>Couldn&apos;t load psychologists: {error}</p>}

        <div className={styles.grid}>
          {loading &&
            items.length === 0 &&
            [0, 1, 2].map((n) => (
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
          {items.map((psychologist) => (
            <PsychologistCard
              key={psychologist.id}
              psychologist={psychologist}
              onRequireAuth={() => setAuthPromptOpen(true)}
              onBookAppointment={setAppointmentTarget}
            />
          ))}
        </div>

        {!loading && items.length === 0 && !error && (
          <p className={styles.emptyText}>No psychologists found.</p>
        )}

        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button
              type="button"
              className={styles.loadMoreButton}
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={Boolean(appointmentTarget)}
        onClose={() => setAppointmentTarget(null)}
        psychologist={appointmentTarget}
      />

      <AuthPromptModal
        isOpen={authPromptOpen}
        onClose={() => setAuthPromptOpen(false)}
        onLogin={() => {
          setAuthPromptOpen(false);
          setAuthModalOpen(true);
        }}
      />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
