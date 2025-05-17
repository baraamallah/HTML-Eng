
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey) {
  console.warn(
    'Firebase API Key is missing. Make sure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file and you have restarted your development server.'
  );
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side or where window is available
  if (getApps().length === 0) {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) { // Check if essential config values are present
        app = initializeApp(firebaseConfig);
    } else {
        console.error("Firebase config is missing essential values (apiKey or projectId). Firebase not initialized.");
        // Provide dummy objects to prevent app from crashing if Firebase is not initialized
        // @ts-ignore
        app = {}; 
        // @ts-ignore
        auth = {};
        // @ts-ignore
        db = {};
        // @ts-ignore
        storage = {};
    }
  } else {
    app = getApps()[0];
  }

  if (app && app.name) { // Check if app was successfully initialized
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else if (!app || !app.name) {
    // Handle the case where app initialization failed but didn't throw earlier
    // This ensures auth, db, storage are defined to prevent runtime errors for "undefined"
    console.error("Firebase app object is not valid. Ensure Firebase was initialized correctly.");
    // @ts-ignore
    auth = {};
    // @ts-ignore
    db = {};
    // @ts-ignore
    storage = {};
  }
} else {
  // If on the server, provide dummy objects or handle as appropriate
  // For now, keeping them as potentially undefined on server and relying on client-side usage
  // Or, initialize for admin SDK if server-side operations are needed
   // @ts-ignore
   auth = {}; // Provide dummy/placeholder objects
   // @ts-ignore
   db = {};
   // @ts-ignore
   storage = {};
   console.warn("Firebase SDK intended for client-side, dummy objects provided for server-side rendering context if imported directly.");
}


export { app, auth, db, storage };
