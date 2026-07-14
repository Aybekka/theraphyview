import { useEffect, useRef, useState } from 'react';
import styles from './SortControl.module.css';

const OPTIONS = [
  { value: 'name-asc', label: 'A to Z' },
  { value: 'name-desc', label: 'Z to A' },
  { value: 'price-asc', label: 'Less than 10$' },
  { value: 'price-desc', label: 'Greater than 10$' },
  { value: 'rating-desc', label: 'Popular' },
  { value: 'rating-asc', label: 'Not popular' },
  { value: 'name-asc', label: 'Show all' },
];

export default function SortControl({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const current = OPTIONS.find((option) => option.value === value) || OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;
    function handleOutsideClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function handleSelect(option) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <span className={styles.label} id="sort-label">
        Filters
      </span>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="sort-label"
      >
        {current.label}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox" aria-labelledby="sort-label">
          {OPTIONS.map((option) => (
            <li key={option.label}>
              <button
                type="button"
                role="option"
                aria-selected={option.label === current.label}
                className={`${styles.option} ${
                  option.label === current.label ? styles.optionActive : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
