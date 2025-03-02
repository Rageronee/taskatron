import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD2t-Nwzy6W1mNajrS_FX1OxJKxm4sJPvM",
  authDomain: "mkb4a-b5498.firebaseapp.com",
  projectId: "mkb4a-b5498",
  storageBucket: "mkb4a-b5498.firebasestorage.app",
  messagingSenderId: "1056318653155",
  appId: "1:1056318653155:web:de03baf7f11b03100c3bd6",
  measurementId: "G-QRZ86BMRK7",
  databaseURL: "https://mkb4a-b5498-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const initializeFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getDatabase(app);
    const auth = getAuth(app);
    return { app, analytics, db, auth };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Tambahkan error reporting service di sini
    throw error;
  }
};

const { app, analytics, db, auth } = initializeFirebase();
export { analytics, db, auth }; 