
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      'Firebase API Key or Project ID is missing. Please check your .env.local file and ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set.'
    );
  }

  if (getApps().length === 0) {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
    } else {
      // Provide a non-functional mock app if config is missing to prevent hard crashes
      app = { name: "mock-missing-config-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
      console.warn("Firebase not initialized due to missing configuration. App will not function correctly with Firebase services.");
    }
  } else {
    app = getApps()[0];
  }

  // Initialize services only if the app was properly initialized (or a valid app already exists)
  // and not the mock-missing-config-app
  if (app && app.name !== "mock-missing-config-app") {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Provide dummy/mock objects for services if app initialization failed
    // @ts-ignore
    auth = {} as Auth;
    // @ts-ignore
    db = {} as Firestore;
    // @ts-ignore
    storage = {} as FirebaseStorage;
  }

} else {
  // If on the server, provide dummy/mock objects for all exports
  // to prevent errors if these are imported in server-side code that might not be tree-shaken.
  // @ts-ignore
  app = { name: "mock-server-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
  // @ts-ignore
  auth = {} as Auth;
  // @ts-ignore
  db = {} as Firestore;
  // @ts-ignore
  storage = {} as FirebaseStorage;
}

export { app, auth, db, storage };
