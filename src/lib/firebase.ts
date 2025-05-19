
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

const MOCK_APP = { name: "mock-app", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
const MOCK_AUTH = { type: 'auth-mock' } as unknown as Auth; // Cast to satisfy type, knowing it's a mock
const MOCK_DB = { type: 'firestore-mock' } as unknown as Firestore;
const MOCK_STORAGE = { type: 'storage-mock' } as unknown as FirebaseStorage;


if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      'Firebase Error: Critical configuration (API Key or Project ID) is missing. Please check your .env.local file or deployment environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID). Firebase services will be mocked.'
    );
    app = MOCK_APP;
    auth = MOCK_AUTH;
    db = MOCK_DB;
    storage = MOCK_STORAGE;
  } else {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized successfully.");
      } else {
        app = getApps()[0];
        console.log("Firebase app already initialized.");
      }
      // Initialize services only if the app was properly initialized
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    } catch (e: any) {
      console.error("Firebase Error: Failed to initialize Firebase app. ", e.message, e.stack);
      console.error("Firebase Config Used:", {
        apiKey: firebaseConfig.apiKey ? 'Exists' : 'MISSING_OR_EMPTY',
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId ? 'Exists' : 'MISSING_OR_EMPTY',
        storageBucket: firebaseConfig.storageBucket,
        messagingSenderId: firebaseConfig.messagingSenderId,
        appId: firebaseConfig.appId,
      });
      app = MOCK_APP;
      auth = MOCK_AUTH;
      db = MOCK_DB;
      storage = MOCK_STORAGE;
    }
  }
} else {
  // Server-side mocks (to prevent errors if imported in server-side code that might not be tree-shaken)
  app = MOCK_APP;
  auth = MOCK_AUTH;
  db = MOCK_DB;
  storage = MOCK_STORAGE;
}

export { app, auth, db, storage };
