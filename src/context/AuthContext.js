import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { removeUserData } from '../services/taskService';

const SESSION_KEY = '@cp4_mobile_session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser ? { uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName } : null);
      try {
        if (currentUser) await AsyncStorage.setItem(SESSION_KEY, 'active');
        else await AsyncStorage.removeItem(SESSION_KEY);
      } catch {
        // A persistência da autenticação é gerenciada pelo próprio Firebase.
      } finally { setLoading(false); }
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async register(name, email, password) {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      await AsyncStorage.setItem(SESSION_KEY, 'active');
      setUser({ uid: credential.user.uid, email: credential.user.email, displayName: name.trim() });
    },
    async login(email, password) {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await AsyncStorage.setItem(SESSION_KEY, 'active');
      setUser({ uid: credential.user.uid, email: credential.user.email, displayName: credential.user.displayName });
    },
    async logout() {
      await signOut(auth);
      await AsyncStorage.removeItem(SESSION_KEY);
      setUser(null);
    },
    async resetPassword(email) {
      return sendPasswordResetEmail(auth, email.trim());
    },
    async removeAccount(password) {
      if (!auth.currentUser) return;
      const currentUser = auth.currentUser;
      await reauthenticateWithCredential(currentUser,
        EmailAuthProvider.credential(currentUser.email, password));
      await removeUserData(currentUser.uid);
      await deleteUser(currentUser);
      await AsyncStorage.removeItem(SESSION_KEY);
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
