
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
  storageBucket: "devportfolio-hub.appspot.com", // Corrected typical storage bucket format
  messagingSenderId: "834909353622",
  appId: "1:834909353622:web:305f430d3c0698597d74b7",
  measurementId: "G-KDKWHPVWXP" // Optional, typically for Analytics
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
   // @ts-ignore
   auth = {}; // Provide dummy/placeholder objects
   // @ts-ignore
   db = {};
   // @ts-ignore
   storage = {};
   console.warn("Firebase SDK intended for client-side, dummy objects provided for server-side rendering context if imported directly.");
}

export { app, auth, db, storage };
