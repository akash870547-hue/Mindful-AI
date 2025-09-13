import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-2747945589-ff2f0',
  appId: '1:353130084395:web:1e116aefaf9b3d79b3126e',
  storageBucket: 'studio-2747945589-ff2f0.firebasestorage.app',
  apiKey: 'AIzaSyA5BfQwmHEcF8CtOnsR3AhD2GHu-srqAYE',
  authDomain: 'studio-2747945589-ff2f0.firebaseapp.com',
  messagingSenderId: '353130084395',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
