import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPsychologistsPage } from '../firebase/database';

const PAGE_SIZE = 3;

export function usePsychologists(sortValue) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cursorRef = useRef(null);
  const requestIdRef = useRef(0);

  const [sortField, sortDirection] = sortValue.split('-');

  const loadPage = useCallback(
    async (isInitial) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const page = await fetchPsychologistsPage({
          sortField,
          sortDirection,
          pageSize: PAGE_SIZE,
          cursor: isInitial ? null : cursorRef.current,
        });
        if (requestId !== requestIdRef.current) return;

        cursorRef.current = page.nextCursor;
        setItems((prev) => (isInitial ? page.items : [...prev, ...page.items]));
        setHasMore(page.hasMore);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err.message);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [sortField, sortDirection]
  );

  useEffect(() => {
    setItems([]);
    cursorRef.current = null;
    setHasMore(true);
    loadPage(true);
  }, [loadPage]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore: () => loadPage(false),
  };
}
