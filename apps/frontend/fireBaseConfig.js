// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVOZvtpu69JejCO7sGAsva0-Gc8RpiMdY",
  authDomain: "agentity-ee07f.firebaseapp.com",
  projectId: "agentity-ee07f",
  storageBucket: "agentity-ee07f.firebasestorage.app",
  messagingSenderId: "925928725630",
  appId: "1:925928725630:web:0a76bd6b3d2890bea18c2f",
  measurementId: "G-9S0QLQPY7H",
};

const app = initializeApp(firebaseConfig);

// pass app into getAuth so it’s bound to this Firebase app
const auth = getAuth(app);

// optional, guard analytics for environments where it’s not supported
let analytics;
try {
  analytics = getAnalytics(app);
} catch {
  // ignore analytics errors in non-browser envs (e.g., Vite SSR/build)
}

// Google provider for sign‑in
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
