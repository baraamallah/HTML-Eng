
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
    // firebaseConfig is hardcoded, so apiKey and projectId checks are implicitly met.
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Assuming app is always successfully initialized here because firebaseConfig is hardcoded
  // and getApps()[0] would return a valid app if one exists.
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

} else {
  // If on the server, provide dummy/mock objects for all exports
  // to prevent errors if these are imported in server-side code.
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
