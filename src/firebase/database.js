import {
  ref,
  query,
  orderByChild,
  limitToFirst,
  limitToLast,
  startAfter,
  endBefore,
  get,
  set,
  remove,
  onValue,
} from 'firebase/database';
import { db } from './config';

const PSYCHOLOGISTS_PATH = 'psychologists';
const USERS_PATH = 'users';

const SORT_FIELD_MAP = {
  name: 'name',
  price: 'price_per_hour',
  rating: 'rating',
};

export async function fetchPsychologistsPage({
  sortField = 'name',
  sortDirection = 'asc',
  pageSize = 3,
  cursor = null,
}) {
  const dbField = SORT_FIELD_MAP[sortField] || 'name';
  const psychologistsRef = ref(db, PSYCHOLOGISTS_PATH);
  const probeSize = pageSize + 1;

  const constraints = [orderByChild(dbField)];
  if (sortDirection === 'desc') {
    if (cursor) {
      constraints.push(endBefore(cursor.value, cursor.key));
    }
    constraints.push(limitToLast(probeSize));
  } else {
    if (cursor) {
      constraints.push(startAfter(cursor.value, cursor.key));
    }
    constraints.push(limitToFirst(probeSize));
  }

  const snapshot = await get(query(psychologistsRef, ...constraints));
  const fetched = [];
  snapshot.forEach((child) => {
    fetched.push({ id: child.key, ...child.val() });
  });

  if (sortDirection === 'desc') {
    fetched.reverse();
  }

  const hasMore = fetched.length > pageSize;
  const items = fetched.slice(0, pageSize);
  const lastItem = items.length > 0 ? items[items.length - 1] : null;
  const nextCursor = lastItem ? { value: lastItem[dbField], key: lastItem.id } : cursor;

  return { items, nextCursor, hasMore };
}

export async function fetchAllPsychologists() {
  const snapshot = await get(ref(db, PSYCHOLOGISTS_PATH));
  const items = [];
  snapshot.forEach((child) => {
    items.push({ id: child.key, ...child.val() });
  });
  return items;
}

export function subscribeToFavorites(uid, callback) {
  const favRef = ref(db, `${USERS_PATH}/${uid}/favorites`);
  return onValue(favRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

export async function addFavorite(uid, psychologistId) {
  await set(ref(db, `${USERS_PATH}/${uid}/favorites/${psychologistId}`), true);
}

export async function removeFavorite(uid, psychologistId) {
  await remove(ref(db, `${USERS_PATH}/${uid}/favorites/${psychologistId}`));
}
