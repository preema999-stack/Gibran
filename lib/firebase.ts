import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC8OmK49wVhiIRUqZdgoNSXZrsWxt1kwN4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gibran-2f16c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gibran-2f16c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gibran-2f16c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "503159218285",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:503159218285:web:ab8cf15aa824902b209f64",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-G920MQL9XQ",
};

// Initialize Firebase (SSR-safe singleton pattern)
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore & Cloud Storage
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

let analyticsInstance: Analytics | null = null;

/**
 * Initializes and retrieves Firebase Analytics on the client side safely.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;

  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  } catch (err) {
    console.warn("Firebase Analytics could not be initialized:", err);
  }
  return null;
}

export { analyticsInstance as analytics };
