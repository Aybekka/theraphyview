import Modal from '../Modal/Modal';
import styles from './AuthPromptModal.module.css';

export default function AuthPromptModal({ isOpen, onClose, onLogin }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Authorization required">
      <h2 className={styles.heading}>Only for authorized users</h2>
      <p className={styles.description}>
        Adding psychologists to your favorites is available for authorized users only. Please log
        in to your account or create a new one to save specialists you like.
      </p>
      <button type="button" className={styles.loginButton} onClick={onLogin}>
        Log In
      </button>
    </Modal>
  );
}
