import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../Modal/Modal';
import { registerUser, loginUser } from '../../firebase/auth';
import styles from './AuthModal.module.css';

const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const registerSchema = loginSchema.shape({
  name: yup.string().required('Name is required'),
});

const COPY = {
  login: {
    title: 'Log In',
    description:
      'Welcome back! Please enter your credentials to access your account and continue your search for a psychologist.',
    submit: 'Log In',
  },
  register: {
    title: 'Registration',
    description:
      'Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.',
    submit: 'Sign Up',
  },
};

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5c5 0 9 4.5 10 7-1 2.5-5 7-10 7S3 14.5 2 12c1-2.5 5-7 10-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4l18 16M10.6 6.3A9.8 9.8 0 0 1 12 6c5 0 9 4.5 10 6.5a13.3 13.3 0 0 1-3.2 3.8M6.4 8.2A13 13 0 0 0 2 12.5C3 14.5 7 19 12 19c1.3 0 2.5-.3 3.6-.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.9 10.3a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const schema = mode === 'login' ? loginSchema : registerSchema;
  const copy = COPY[mode];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPassword(false);
      setFirebaseError('');
    }
  }, [isOpen, initialMode]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setFirebaseError('');
    reset();
  }

  async function onSubmit(data) {
    setFirebaseError('');
    try {
      if (mode === 'login') {
        await loginUser(data);
      } else {
        await registerUser(data);
      }
      reset();
      onClose();
    } catch (error) {
      setFirebaseError(error.message.replace('Firebase: ', ''));
    }
  }

  function handleClose() {
    reset();
    setFirebaseError('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={copy.title}>
      <h2 className={styles.heading}>{copy.title}</h2>
      <p className={styles.description}>{copy.description}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
        {mode === 'register' && (
          <div className={styles.field}>
            <input placeholder="Name" {...register('name')} />
            {errors.name && <span className={styles.error}>{errors.name.message}</span>}
          </div>
        )}

        <div className={styles.field}>
          <input placeholder="Email" type="email" {...register('email')} />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

        <div className={styles.field}>
          <div className={styles.passwordWrap}>
            <input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>

        {firebaseError && <p className={styles.firebaseError}>{firebaseError}</p>}

        <button type="submit" disabled={isSubmitting} className={styles.submit}>
          {copy.submit}
        </button>
      </form>

      <p className={styles.switchText}>
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => switchMode('register')} className={styles.link}>
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => switchMode('login')} className={styles.link}>
              Log In
            </button>
          </>
        )}
      </p>
    </Modal>
  );
}
