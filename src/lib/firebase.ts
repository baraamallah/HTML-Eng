
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// User-provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDelN4gM_U9wAyFUIiBvMI5piWfhkfgiFo",
  authDomain: "devportfolio-hub.firebaseapp.com",
  // databaseURL: "https://devportfolio-hub-default-rtdb.firebaseio.com", // Realtime Database URL, not used by Firestore
  projectId: "devportfolio-hub",
  storageBucket: "devportfolio-hub.firebasestorage.app", // User-provided, ensure this is correct for your project
  messagingSenderId: "834909353622",
  appId: "1:834909353622:web:305f430d3c0698597d74b7",
  measurementId: "G-KDKWHPVWXP" // Optional, typically for Analytics
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (getApps().length === 0) {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) { // Check if essential config values are present
        app = initializeApp(firebaseConfig);
    } else {
        // This case should ideally not be reached if config is hardcoded correctly
        console.error("Firebase config is missing essential values (apiKey or projectId) in firebase.ts. Firebase not initialized.");
        // Provide dummy objects to prevent app from crashing if Firebase is not initialized
        // @ts-ignore
        app = {}; 
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
    console.error("Firebase app object is not valid in firebase.ts. Ensure Firebase was initialized correctly.");
    // @ts-ignore
    auth = {} as Auth;
    // @ts-ignore
    db = {} as Firestore;
    // @ts-ignore
    storage = {} as FirebaseStorage;
  }
} else {
  // If on the server, provide dummy objects or handle as appropriate
  // For now, keeping them as potentially uninitialized on server and relying on client-side usage for Firebase SDKs.
  // Server-side Firebase (Admin SDK) would be a different setup.
   // @ts-ignore
   auth = {} as Auth; 
   // @ts-ignore
   db = {} as Firestore;
   // @ts-ignore
   storage = {} as FirebaseStorage;
   // console.warn("Firebase client SDKs are intended for client-side. Dummy objects provided if imported server-side.");
}

export { app, auth, db, storage };
