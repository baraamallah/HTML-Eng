
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Configuration directly provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDelN4gM_U9wAyFUIiBvMI5piWfhkfgiFo",
  authDomain: "devportfolio-hub.firebaseapp.com",
  // databaseURL: "https://devportfolio-hub-default-rtdb.firebaseio.com", // Not needed for Firestore
  projectId: "devportfolio-hub",
  storageBucket: "devportfolio-hub.appspot.com", // Corrected from devportfolio-hub.firebasestorage.app
  messagingSenderId: "834909353622",
  appId: "1:834909353622:web:305f430d3c0698597d74b7",
  measurementId: "G-KDKWHPVWXP" // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase initializeApp failed with hardcoded config:", e);
      // @ts-ignore
      app = { name: "mock-initialization-failed-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
    }
  } else {
    app = getApps()[0];
  }

  // Initialize services only if the app was properly initialized
  // @ts-ignore
  if (app && app.name !== "mock-initialization-failed-app") {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Fallback to mock objects if Firebase app wasn't properly initialized
    // @ts-ignore
    auth = { type: 'auth-mock-client-init-failed' } as Auth;
    // @ts-ignore
    db = { type: 'firestore-mock-client-init-failed' } as Firestore;
    // @ts-ignore
    storage = { type: 'storage-mock-client-init-failed' } as FirebaseStorage;
    console.warn("Firebase services (auth, db, storage) are using mock objects due to initialization failure with hardcoded config.");
  }

} else {
  // Server-side mocks (to prevent errors if imported in server-side code that might not be tree-shaken)
  // @ts-ignore
  app = { name: "mock-server-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
  // @ts-ignore
  auth = { type: 'auth-mock-server' } as Auth;
  // @ts-ignore
  db = { type: 'firestore-mock-server' } as Firestore;
  // @ts-ignore
  storage = { type: 'storage-mock-server' } as FirebaseStorage;
}

export { app, auth, db, storage };
