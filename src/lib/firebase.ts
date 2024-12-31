import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth();

export const STORAGE_BASE = import.meta.env.PROD ? "production" : "development";

export const MENU_COLLECTION = import.meta.env.PROD
  ? "production__menu"
  : "development__menu";
export const MENU_IMAGES = `${STORAGE_BASE}/menu-images`;

export const DISCOUNT_COLLECTION = import.meta.env.PROD
  ? "production__discount"
  : "development__discount";

export const MANAGER_COLLECTION = import.meta.env.PROD
  ? "production__manager"
  : "development__manager";
export const MANAGER_DEFAULT_IMAGE = "/user-image.png";

export const FEEDBACK_COLLECTION = import.meta.env.PROD
  ? "production__feedback"
  : "development__feedback";
