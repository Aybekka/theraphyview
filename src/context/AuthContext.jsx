import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { subscribeToFavorites } from '../firebase/database';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setFavorites({});
      return;
    }
    const unsubscribeFavorites = subscribeToFavorites(currentUser.uid, setFavorites);
    return unsubscribeFavorites;
  }, [currentUser]);

  const value = {
    currentUser,
    favorites,
    authLoading,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
