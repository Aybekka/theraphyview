import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../Modal/Modal';
import styles from './AppointmentModal.module.css';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s()-]{7,}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  time: yup.string().required('Meeting time is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  comment: yup.string().required('Please add a short comment'),
});

export default function AppointmentModal({ isOpen, onClose, psychologist }) {
  const [timeOpen, setTimeOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timeRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), defaultValues: { time: '' } });

  const selectedTime = watch('time');

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setTimeOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!timeOpen) return undefined;
    function handleOutsideClick(event) {
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setTimeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [timeOpen]);

  function handleClose() {
    reset();
    setSubmitted(false);
    onClose();
  }

  async function onSubmit() {
    setSubmitted(true);
    reset();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Make an appointment">
      {submitted ? (
        <div className={styles.success}>
          <h2 className={styles.heading}>Request sent!</h2>
          <p className={styles.description}>
            Thank you for booking an appointment with {psychologist?.name}. We will contact you
            shortly to confirm the meeting details.
          </p>
          <button type="button" className={styles.submit} onClick={handleClose}>
            Done
          </button>
        </div>
      ) : (
        <>
          <h2 className={styles.heading}>Make an appointment with a psychologists</h2>
          <p className={styles.description}>
            You are on the verge of changing your life for the better. Fill out the short form
            below to book your personal appointment with a professional psychologist. We guarantee
            confidentiality and respect for your privacy.
          </p>

          {psychologist && (
            <div className={styles.psychologist}>
              <img
                src={psychologist.avatar_url}
                alt={psychologist.name}
                className={styles.psychologistAvatar}
              />
              <div className={styles.psychologistInfo}>
                <span className={styles.psychologistLabel}>Your psychologists</span>
                <span className={styles.psychologistName}>{psychologist.name}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className={styles.field}>
              <input placeholder="Name" {...register('name')} />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <input placeholder="+380" type="tel" {...register('phone')} />
                {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
              </div>

              <div className={styles.field} ref={timeRef}>
                <button
                  type="button"
                  className={styles.timeTrigger}
                  onClick={() => setTimeOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={timeOpen}
                >
                  <span className={selectedTime ? '' : styles.timePlaceholder}>
                    {selectedTime || '00:00'}
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M12 7v5l3 3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {timeOpen && (
                  <div className={styles.timeDropdown}>
                    <span className={styles.timeTitle}>Meeting time</span>
                    <ul className={styles.timeList} role="listbox">
                      {TIME_SLOTS.map((slot) => (
                        <li key={slot}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={slot === selectedTime}
                            className={`${styles.timeOption} ${
                              slot === selectedTime ? styles.timeOptionActive : ''
                            }`}
                            onClick={() => {
                              setValue('time', slot, { shouldValidate: true });
                              setTimeOpen(false);
                            }}
                          >
                            {slot.replace(':', ' : ')}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {errors.time && <span className={styles.error}>{errors.time.message}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <input placeholder="Email" type="email" {...register('email')} />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            <div className={styles.field}>
              <textarea placeholder="Comment" rows={4} {...register('comment')} />
              {errors.comment && <span className={styles.error}>{errors.comment.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submit}>
              Send
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
