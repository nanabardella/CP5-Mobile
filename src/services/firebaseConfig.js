import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB4z_0RbR17WOZsWwmKGTTJDZ-8FtSu95E',
  authDomain: 'cp4mobile-a5bca.firebaseapp.com',
  projectId: 'cp4mobile-a5bca',
  storageBucket: 'cp4mobile-a5bca.firebasestorage.app',
  messagingSenderId: '903099068645',
  appId: '1:903099068645:web:01e21a6855a74d719be40c'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app; 
