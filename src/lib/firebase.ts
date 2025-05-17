
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
  // More explicit check for missing or empty essential keys
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.trim() === "" || !firebaseConfig.projectId || firebaseConfig.projectId.trim() === "") {
    console.error(
      "Firebase Initialization Error: API Key or Project ID is missing or empty. \n" +
      "1. Ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set in your .env.local file (at the project root). \n" +
      "2. Verify the values are correct from your Firebase project settings. \n" +
      "3. Restart your Next.js development server (npm run dev) after changes to .env.local."
    );
  }

  if (getApps().length === 0) {
    // Initialize Firebase only if essential keys are present and non-empty
    if (firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== "" && firebaseConfig.projectId && firebaseConfig.projectId.trim() !== "") {
      try {
        app = initializeApp(firebaseConfig);
      } catch (e) {
        console.error("Firebase initializeApp failed:", e);
        // @ts-ignore
        app = { name: "mock-initialization-failed-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
      }
    } else {
      // @ts-ignore
      app = { name: "mock-missing-config-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
      // The error above should already indicate this, but a specific warning here is also fine.
      console.warn("Firebase not initialized due to missing or empty API Key/Project ID. App will not function correctly with Firebase services.");
    }
  } else {
    app = getApps()[0];
  }

  // Initialize services only if the app was properly initialized
  // @ts-ignore
  if (app && app.name !== "mock-missing-config-app" && app.name !== "mock-initialization-failed-app") {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Fallback to mock objects if Firebase app wasn't properly initialized
    // These mocks won't function but prevent further crashes if code tries to use them.
    // @ts-ignore
    auth = { type: 'auth-mock-client-init-failed' } as Auth;
    // @ts-ignore
    db = { type: 'firestore-mock-client-init-failed' } as Firestore;
    // @ts-ignore
    storage = { type: 'storage-mock-client-init-failed' } as FirebaseStorage;
    console.warn("Firebase services (auth, db, storage) are using mock objects due to initialization failure.");
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
