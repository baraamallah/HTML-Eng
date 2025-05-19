
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// These are expected to be set in your .env.local file or deployment environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      'Firebase API Key or Project ID is missing. Please check your .env.local file or deployment environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID).'
    );
    // @ts-ignore - Assign mock objects if config is incomplete to prevent app crash
    app = { name: "mock-config-missing-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
    // @ts-ignore
    auth = { type: 'auth-mock-config-missing' } as Auth;
    // @ts-ignore
    db = { type: 'firestore-mock-config-missing' } as Firestore;
    // @ts-ignore
    storage = { type: 'storage-mock-config-missing' } as FirebaseStorage;

  } else if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase initializeApp failed:", e);
      // @ts-ignore
      app = { name: "mock-initialization-failed-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
    }
  } else {
    app = getApps()[0];
  }

  // Initialize services only if the app was properly initialized
  // @ts-ignore
  if (app && app.name !== "mock-config-missing-app" && app.name !== "mock-initialization-failed-app") {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Ensure mock objects if app is still not properly initialized
    // @ts-ignore
    if (!auth) auth = { type: 'auth-mock-client-init-failed' } as Auth;
    // @ts-ignore
    if (!db) db = { type: 'firestore-mock-client-init-failed' } as Firestore;
    // @ts-ignore
    if (!storage) storage = { type: 'storage-mock-client-init-failed' } as FirebaseStorage;
    if (app.name !== "mock-config-missing-app") { // Avoid double logging if config was missing
        console.warn("Firebase services (auth, db, storage) are using mock objects due to initialization failure. Check Firebase config.");
    }
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
